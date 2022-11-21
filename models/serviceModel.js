const mongoose = require("mongoose");

const opts = {
      toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
      }
}

const serviceSchema = mongoose.Schema({
      type: {
            type: String,
            required: true
      },
      quantity: {
            type: Number,
            required: true
      },
      unitPrice: {
            type: Number,
            required: true
      },
      subtotal: {
            type: Number,
            required: true,
            default: function () {
                  return this.quantity * this.unitPrice
            }
      },
      sizes: [
            {
                  title: {
                        type: String,

                  },
                  value: {
                        type: Number,

                  }
            }
      ],
      styles: [],
      imageUrl: {
            type: String,
            required: true
      },
      servedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
      },
      status: {
            type: String,
            default: "pending"
      },
      menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true
      }, 
      order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
      },
}, opts);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;