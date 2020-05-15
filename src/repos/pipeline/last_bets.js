import mongoose from 'mongoose';


const pipelineGame = (game)=>{
  if(game==null) return {};
  return [{
    '$match': {
      'game': typeof game =='string' ? mongoose.Types.ObjectId(game) : game
    }
  }];
}

const pipeline_last_bets = (_id, game, { offset, size }) =>
[
  {
    '$match': {
      'isJackpot': false
    }
  },
  {
    '$match': {
      'app': typeof _id == 'string' ? mongoose.Types.ObjectId(_id) : _id
    }
  },
  ...pipelineGame(game),
  {
    '$sort': {
      'timestamp': -1
    }
  }, {
    '$limit': size
  }, {
    '$lookup': {
      'from': 'users',
      'localField': 'user',
      'foreignField': '_id',
      'as': 'user'
    }
  }, {
    '$lookup': {
      'from': 'games',
      'localField': 'game',
      'foreignField': '_id',
      'as': 'game'
    }
  }, {
    '$project': {
      'bet': true,
      'user': {
        '$arrayElemAt': [
          '$user', 0
        ]
      },
      'game': {
        '$arrayElemAt': [
          '$game', 0
        ]
      },
      'bet': {
        '_id': '$_id',
        'betAmount': '$betAmount',
        'winAmount': '$winAmount',
        'isWon': '$isWon',
        'timestamp': '$timestamp',
        'currency': '$currency'
      }
    }
  }, {
    '$lookup': {
      'from': 'currencies',
      'localField': 'bet.currency',
      'foreignField': '_id',
      'as': 'currency'
    }
  }, {
    '$project': {
      'currency': {
        '$arrayElemAt': [
          '$currency', 0
        ]
      },
      'bet': '$bet',
      'user': '$user',
      'game': '$game'
    }
  }
];

export default pipeline_last_bets;