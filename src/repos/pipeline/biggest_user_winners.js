import mongoose from 'mongoose';

const pipeline_biggest_user_winners = (_id, { offset, size }) =>
[
  {
    '$match': {
      'app': typeof _id == 'string' ? mongoose.Types.ObjectId(_id) : _id
    }
  }, {
    '$match': {
      'isJackpot': false
    }
  }, {
    '$group': {
      '_id': {
        'user': '$user',
        'game': '$game',
        'currency': '$currency'
      },
      'winAmount': {
        '$sum': '$winAmount'
      }
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
      'localField': '_id.game',
      'foreignField': '_id',
      'as': 'game'
    }
  }, {
    '$lookup': {
      'from': 'currencies',
      'localField': '_id.currency',
      'foreignField': '_id',
      'as': 'currency'
    }
  }, {
    '$lookup': {
      'from': 'users',
      'localField': '_id.user',
      'foreignField': '_id',
      'as': 'user'
    }
  }, {
    '$project': {
      'game': {
        '$arrayElemAt': [
          '$game', 0
        ]
      },
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
      'winAmount': '$winAmount',
      '_id': false
    }
  }, {
    '$project': {
      'game': {
        '_id': '$game._id',
        'name': '$game.name',
        'metaName': '$game.metaName',
        'image_url': '$game.image_url'
      },
      'currency': {
        '_id': '$currency._id',
        'name': '$currency.name',
        'ticker': '$currency.ticker',
        'image': '$currency.image'
      },
      'user': {
        '_id': '$user._id',
        'username': '$user.username'
      },
      'winAmount': '$winAmount'
    }
  }
]

export default pipeline_biggest_user_winners;