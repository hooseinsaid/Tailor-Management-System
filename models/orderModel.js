const mongoose = require("mongoose");

const justDate = require("../utils/justDate");

const opts = {
      toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
      }
}


const orderSchema = mongoose.Schema({
      orderNumber: {
            type: Number,
            default: 1,
            required: true
      },
      services: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Service"
            }
      ],
      customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
      },

      advance: {
            type: Number,
            required: true,
      },
      deadline: {
            type: Date,
            // required: true,
            default: justDate(new Date())
      },
      date: {
            type: Date,
            required: true,
            default: justDate(new Date()),
      },
      status: {
            type: String,
            lowercase: true,
            default: "pending",
            enum: ["pending", "on-service", "finished", "taken", "invoiced", "cancelled", "left"]
      },
      user: {
            type: String,
            // required: true
      },
      payments: [
            {
                  description: {
                        type: String,
                        required: true
                  },
                  amount: {
                        type: Number,
                        required: true
                  },
                  user: {
                        type: String
                  },
                  date: {
                        type: Date,
                        required: true,
                        default: justDate(new Date()),
                  },
                  paymentMethod: {
                        type: String,
                        required: true,
                        lowercase: true,
                        default: "cash",
                        enum: ['cash', 'invoice']
                  }
            }
      ]
}, opts);

// create a virtual property `Ref` that's computed from `orderNumber`
orderSchema.virtual('Ref').get(function () {
      let number;
      if (this.orderNumber / 10 < 1) {
            number = `00${this.orderNumber}`
      } else if (this.orderNumber / 100 < 1) {
            number = `0${this.orderNumber}`
      } else {
            number = this.orderNumber
      }
      return `ORD-${number}`;
});

// create a virtual property `balance` that's computed from `total` & `payments`
orderSchema.virtual('total').get(function () {
      let amount = 0;
      this.services.forEach(service => {
            amount += service.subtotal
      });
      return amount;
});
// create a virtual property `balance` that's computed from `total` & `payments`
orderSchema.virtual('balance').get(function () {
      let price = this.total - this.advance;
      this.payments.forEach(payment => {
            price -= payment.amount
      });
      return price;
});

// create a virtual property `name` that's computed from `services type`
orderSchema.virtual('name').get(function () {
      let type = '';

      for (let index = 0; index < this.services.length; index++) {
            const service = this.services[index];
            if (index == 0) {
                  type += service.type;
            } else if (index != this.services.length - 1) {
                  type += ` ${service.type}`
            } else {
                  type += ` & ${service.type}`
            }

      }
      return type;
});

// auto generate Order ID
orderSchema.pre("validate", async function (next) {
      //sorting students
      const orders = await Order.find({}).sort([["orderNumber", -1]]);
      if (orders.length > 0) {
            this.orderNumber = orders[0].orderNumber + 1;
      }
      next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;