
var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const contactSchema = {
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  passport: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ['male', 'female']
  },
  birthday: {
    type: Date,
  },
  pob: {
    type: Date,
  },
  nationality: {
    type: String,
    default: 'Somali'
  },
  city: {
    type: String,
  },
  district: {
    type: String,
  },
  phone: {
    type: String,
  }
};

module.exports = contactSchema;