'use strict';

const express = require('express');

const router = express.Router();

const knex = require('../knex');

//GET ALL
router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .orderBy('tags.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

//GET by ID
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('tags')
    .first()
    .where({id: id})
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

//Update Tags (PUT)
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateableFields = ['name'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  //Validate input

  if(!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('tags')
    .update(updateObj)
    .where({id: id})
    .returning(['id', 'name'])
    .then(([item]) => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    });
});


//Create new tag (POST)
router.post('/', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

//Delete tag (DELETE)
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('tags')
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