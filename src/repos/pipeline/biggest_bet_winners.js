import mongoose from 'mongoose';

const pipeline_biggest_bet_winners = (_id, { offset, size }) =>
[
    {
      '$match': {
        '_id': typeof _id == 'string' ? mongoose.Types.ObjectId(_id) : _id
      }
    }, {
      '$lookup': {
        'from': 'games', 
        'localField': 'games', 
        'foreignField': '_id', 
        'as': 'games'
      }
    }, {
      '$unwind': {
        'path': '$games'
      }
    }, {
      '$project': {
        '_id': false, 
        'app': '$_id', 
        'game': {
          '_id': '$games._id', 
          'name': '$games.name', 
          'metaName': '$games.metaName', 
          'image_url': '$games.image_url'
        }, 
        'bets': '$games.bets'
      }
    }, {
      '$unwind': {
        'path': '$bets'
      }
    }, {
      '$lookup': {
        'from': 'bets', 
        'localField': 'bets', 
        'foreignField': '_id', 
        'as': 'bet'
      }
    }, {
      '$project': {
        'app': true, 
        'game': true, 
        'bet': {
          '$arrayElemAt': [
            '$bet', 0
          ]
        }
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'bet.user', 
        'foreignField': '_id', 
        'as': 'bet.user'
      }
    }, {
      '$lookup': {
        'from': 'currencies', 
        'localField': 'bet.currency', 
        'foreignField': '_id', 
        'as': 'bet.currency'
      }
    }, {
      '$project': {
        'app': true, 
        'game': true, 
        'bet': {
          '_id': '$bet._id', 
          'betAmount': '$bet.betAmount', 
          'winAmount': '$bet.winAmount', 
          'isWon': '$bet.isWon', 
          'timestamp': '$bet.timestamp'
        }, 
        'user': {
          '$arrayElemAt': [
            '$bet.user', 0
          ]
        }, 
        'currency': {
          '$arrayElemAt': [
            '$bet.currency', 0
          ]
        }
      }
    }, {
      '$project': {
        'app': true, 
        'game': true, 
        'bet': true, 
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
    },
    {
      '$sort': {
        'bet.winAmount': -1
      }
    },
    {
        '$skip': offset
    },
    {
        '$limit': size
    }
];

export default pipeline_biggest_bet_winners;