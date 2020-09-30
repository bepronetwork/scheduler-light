import mongoose from 'mongoose';

const pipeline_user_stats = (_id, currency, { from_date, to_date }) =>
	[
		{
			'$match': {
				'app': mongoose.Types.ObjectId(_id)
			}
        },
        {
            '$match': {
                "currency": mongoose.Types.ObjectId(currency)
            }
        },
		{
            '$match': {
                'timestamp': { '$gte': from_date, '$lte': to_date }
            }
        },
		{
			'$lookup': {
				'from': 'users',
				'localField': 'user',
				'foreignField': '_id',
				'as': 'user'
			}
		}, {
			'$unwind': {
				'path': '$user'
			}
		}, {
			'$group': {
				'_id': {
					'user': '$user._id',
					'name': '$user.name',
					'email': '$user.email',
					'wallet': '$user.wallet'
				},
				'bets': {
					'$sum': 1
				},
				'betAmount': {
					'$sum': '$betAmount'
				},
				'winAmount': {
					'$sum': '$winAmount'
				}
			}
		}, {
			'$lookup': {
				'from': 'wallets',
				'localField': '_id.wallet',
				'foreignField': '_id',
				'as': 'wallet'
			}
		}, {
			'$project': {
				'_id': '$_id.user',
				'name': '$_id.name',
				'email': '$_id.email',
				'bets': '$bets',
				'betAmount': '$betAmount',
				'winAmount': '$winAmount',
				'profit': {
					'$subtract': [
						'$winAmount', '$betAmount'
					]
				},
				'playBalance': {
					'$arrayElemAt': [
						'$wallet.playBalance', 0
					]
				}
			}
		}
	]

export default pipeline_user_stats;