const mongoose = require('mongoose');

const Schema   = mongoose.Schema;

const groupSchema = new Schema({
  leader:{
    type:String,
    required: true,
  },
  eaters:{
    type:Array,
    required:true,
  },
  restaurant: {
    type:String,
    required:true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
