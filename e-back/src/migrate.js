
require('dotenv').config();
const mongoose = require('mongoose');
const Order   = require('./models/Order');   


async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const usersCol = db.collection('users');
// How many user docs total?
const totalUsers = await usersCol.countDocuments();
console.log('Total users in collection:', totalUsers);

// How many have *any* `orders` field (even empty arrays)?
const withOrdersField = await usersCol.countDocuments({ orders: { $exists: true } });
console.log('Users with an orders field:', withOrdersField);

// How many have a non-empty orders array?
const nonEmptyOrders = await usersCol.countDocuments({
  orders: { $exists: true, $not: { $size: 0 } }
});
console.log('Users with non-empty orders:', nonEmptyOrders);
  // 2) Find all users that still have the old embedded orders array
  const cursor = usersCol.find({ orders: { $exists: true, $not: { $size: 0 } } });
  let migratedCount = 0;

  while (await cursor.hasNext()) {
    const userDoc = await cursor.next();
    const userId  = userDoc._id;
    const embeds  = userDoc.orders;
    console.log(userId)
    if (!Array.isArray(embeds)) continue;

    // 3) For each embedded order, create a new Order document
    for (const e of embeds) {
      await Order.create({
        userId,
        firstname:       e.firstname,
        lastname:        e.lastname,
        phone:           e.phone,
        email:           e.email,
        products:        e.products,
        totalPrice:      e.totalPrice,
        paymentMethod:   e.paymentMethod,
        shippingAddress: e.shippingAddress,
        area:            e.area,
        status:          e.status,
        // if you had timestamps in the embed, you can set createdAt/updatedAt here:
        createdAt:       e.createdAt,
        updatedAt:       e.updatedAt,
      });
      migratedCount++;
    }

    // 4) Remove the old embedded orders field from that user
    await usersCol.updateOne(
      { _id: userId },
      { $unset: { orders: "" } }
    );
  }

  console.log(`✅ Migration complete. ${migratedCount} orders migrated.`);
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
