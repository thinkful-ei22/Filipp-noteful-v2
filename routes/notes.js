'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);

const knex = require('../knex');

// Get All (and search by query)
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.folderId;
  // console.log('SEARCH TERM', searchTerm);
  // console.log('FOLDER-ID', folderId);

  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folders_id', 'folders.id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folders_id', folderId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// Get a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const folderId = req.query.folderId;

  knex('notes')
    .first()
    .where({id: id})
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folders_id', folderId);
      }
    })
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const noteId = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  //console.log('Req Body', req.body);
  const updateableFields = ['title', 'content', 'folders_id'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  //console.log('Update Object', updateObj);

  knex('notes')
    .update(updateObj)
    .where({id: noteId})
    .returning('id')
    .then((result) => {
      console.log('FIRST RESULT', result);
      return knex.select('notes.id', 'title', 'content', 'folders_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folders_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then(([result]) => {
      //console.log('AFTER RESULT', result);
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content, folders_id } = req.body;
  console.log('Post Req body', req.body);
  const newItem = {
    title,
    content,
    folders_id, // Add `folderId`
  };

  let noteId;
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      noteId = id;
      // Using the new id, select the new note and the folder
      return knex.select('notes.id', 'title', 'content', 'folders_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folders_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where({id: id})
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
