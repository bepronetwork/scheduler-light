import mongoose from 'mongoose';

const pipeline_biggest_user_winners = (_id, { offset, size }) =>
[
  {
    '$match': {
      '_id': mongoose.Types.ObjectId(_id)
    }
  }, {
    '$lookup': {
      'from': 'games', 
      'localField': 'games', 
      'foreignField': '_id', 
      'as': 'games'
    }
  }, {
    '$project': {
      'games.bets': true, 
      '_id': false
    }
  }, {
    '$unwind': {
      'path': '$games'
    }
  }, {
    '$project': {
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
      'from': 'games', 
      'localField': 'bet.game', 
      'foreignField': '_id', 
      'as': 'bet.game'
    }
  }, {
    '$project': {
      'bet': true, 
      'user': {
        '$arrayElemAt': [
          '$bet.user', 0
        ]
      }, 
      'game': {
        '$arrayElemAt': [
          '$bet.game', 0
        ]
      }
    }
  }, {
    '$project': {
      '_id': '$bet._id', 
      'betAmount': '$bet.betAmount', 
      'currency': '$bet.currency', 
      'timestamp': '$bet.timestamp', 
      'isWon': '$bet.isWon', 
      'winAmount': '$bet.winAmount', 
      'user': '$user._id', 
      'game': '$game._id'
    }
  }, {
    '$group': {
      '_id': '$user', 
      'winAmount': {
        '$sum': '$winAmount'
      }, 
      'currency': {
        '$first': '$currency'
      }, 
      'game': {
        '$first': '$game'
      }, 
      'user': {
        '$first': '$user'
      }
    }
  }, {
    '$lookup': {
      'from': 'currencies', 
      'localField': 'currency', 
      'foreignField': '_id', 
      'as': 'currency'
    }
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
      'winAmount': '$winAmount'
    }
  },
  {
    '$sort': {
      'winAmount': -1
    }
  },
  {
    '$skip': offset
  },
  {
      '$limit': size
  }
]

export default pipeline_biggest_user_winners;