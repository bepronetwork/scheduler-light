import mongoose from 'mongoose';

const pipelineGame = (game) => {
  if (game == null) return {};
  return [{
    '$match': {
      'game': typeof game == 'string' ? mongoose.Types.ObjectId(game) : game
    }
  }];
}

const pipeline_biggest_bet_winners = (_id, game, { offset, size }) =>
  [
    {
      '$match': {
        'app': typeof _id == 'string' ? mongoose.Types.ObjectId(_id) : _id
      }
    },
    ...pipelineGame(game),
    {
      '$match': {
        'isJackpot': false
      }
    }, {
      '$sort': {
        'winAmount': -1
      }
    }, {
      '$limit': size
    }, {
      '$lookup': {
        'from': 'games',
        'localField': 'game',
        'foreignField': '_id',
        'as': 'game'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'user',
        'foreignField': '_id',
        'as': 'user'
      }
    }, {
      '$lookup': {
        'from': 'currencies',
        'localField': 'currency',
        'foreignField': '_id',
        'as': 'currency'
      }
    }, {
      '$project': {
        'user': {
          '$arrayElemAt': [
            '$user', 0
          ]
        },
        'currency': {
          '$arrayElemAt': [
            '$currency', 0
          ]
        },
        'game': {
          '$arrayElemAt': [
            '$game', 0
          ]
        },
        'app': '$app',
        'bet': {
          '_id': '$_id',
          'betAmount': '$betAmount',
          'winAmount': '$winAmount',
          'isWon': '$isWon',
          'timestamp': '$timestamp'
        },
        '_id': false
      }
    }, {
      '$project': {
        'app': true,
        'bet': true,
        'game': {
          '_id': '$game._id',
          'name': '$game.name',
          'metaName': '$game.metaName',
          'image_url': '$game.image_url'
        },
        'user': {
          '_id': '$user._id',
          'username': '$user.username'
        },
        'currency': {
          '_id': '$currency._id',
          'ticker': '$currency.ticker',
          'name': '$currency.name',
          'image': '$currency.image'
        }
      }
    }
  ]

export default pipeline_biggest_bet_winners;