const createOrderConfirmationEmail = (order) => {
    const productsHtml = order.products.map(product => `
      <tr>
        <td>${product.name}</td>
        <td>${product.size}</td>
        <td>${product.quantity}</td>
        <td>$${product.price}</td>
        <td>-$${product.discount}</td>
      </tr>
    `).join('');

    return `
      <html>
        <body>
          <h2>Order Confirmation</h2>
          <p>Dear ${order.firstname} ${order.lastname},</p>
          <p>Thank you for your order! Here's your order summary:</p>
          
          <h3>Order Details:</h3>
          <p>Order ID: ${order._id}</p>
                    
          <h3>Shipping Address:</h3>
          <p>${order.shippingAddress}</p>
          <p>${order.area}</p>
          
          <h3>Products:</h3>
          <table border="1" cellpadding="10">
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
            </tr>
            ${productsHtml}
          </table>
          
          <h3>Order Summary:</h3>
          <p>Total: $${order.totalPrice}</p>
          <p>Payment Method: ${order.paymentMethod}</p>
          
          <p>We'll notify you when your order ships.</p>
          <p>Best regards,<br>Vibe Wear</p>
        </body>
      </html>
    `;
};

module.exports = { createOrderConfirmationEmail };