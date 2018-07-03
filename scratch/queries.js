'use strict';

const knex = require('../knex');

// let searchTerm = 'gaga';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// Get Note By Id accepts an ID. It returns the note as an object not an array

// let getNoteById = 1003;

// knex('notes')
//   .first()
//   .where({id: getNoteById})
//   .then(results => {
//     console.log(results);
//   })
//   .catch(err => {
//     console.error(err);
//   });

// Update Note By Id accepts an ID and an object with the desired updates. It returns the updated note as an object

// let updateNoteById = 1004;
// let updateObject = {title: 'Best title in the world', content: 'Best content in the world'};

// knex('notes')
//   .update(updateObject)
//   .where({id: updateNoteById})
//   .returning(['id', 'title', 'content'])
//   .then(([results]) => {
//     console.log(results);
//   })
//   .catch(err => {
//     console.error(err);
//   });

//Create a Note accepts an object with the note properties and inserts it in the DB. It returns the new note (including the new id) as an object.

// let newNote = {title: 'Best cat in the world', content: 'Best doggos in the world'};

// knex('notes')
//   .insert(newNote)
//   .returning(['id', 'title', 'content'])
//   .then(([results]) => {
//     console.log(results);
//   })
//   .catch(err => {
//     console.error(err);
//   });

//Delete Note By Id accepts an ID and deletes the note from the DB.

// let deleteById = 1011;

// knex('notes')
//   .where({id: deleteById})
//   .del()
//   .then(console.log(`Note ${deleteById} has been deleted.`))
//   .catch(err => {
//     console.error(err);
//   });
