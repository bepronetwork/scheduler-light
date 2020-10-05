import mongoose from 'mongoose';

const pipeline_balance = (_id) => [
  {
    '$match': {
      '_id': typeof _id == 'string' ? mongoose.Types.ObjectId(_id) : _id
    }
  }, {
    '$lookup': {
      'from': 'users', 
      'localField': 'users', 
      'foreignField': '_id', 
      'as': 'users'
    }
  }, {
    '$unwind': {
      'path': '$users'
    }
  }, {
    '$project': {
      'name': '$name', 
      'users': {
        '_id': '$users._id', 
        'wallet': '$users.wallet'
      }
    }
  }, {
    '$lookup': {
      'from': 'wallets', 
      'localField': 'users.wallet', 
      'foreignField': '_id', 
      'as': 'users.wallet'
    }
  }, {
    '$unwind': {
      'path': '$users.wallet'
    }
  }, {
    '$project': {
      'name': true, 
      'id': '$users._id', 
      'wallet': '$users.wallet'
    }
  }, {
    '$lookup': {
      'from': 'currencies', 
      'localField': 'wallet.currency', 
      'foreignField': '_id', 
      'as': 'wallet.currency'
    }
  }, {
    '$project': {
      'name': true, 
      'id': true, 
      'balance': '$wallet.playBalance', 
      'wallet': true
    }
  }, {
    '$project': {
      'name': true, 
      'id': true, 
      'balance': true, 
      'currency': '$wallet.currency'
    }
  }, {
    '$project': {
      'name': true, 
      'id': true, 
      'balance': true, 
      'currency': {
        '$arrayElemAt': [
          '$currency', 0
        ]
      }
    }
  }, {
    '$project': {
      'name': true, 
      'id': true, 
      'balance': true, 
      'ticker': '$currency.ticker'
    }
  }
];

export default pipeline_balance;