const pharmacistSchema = new mongoose.Schema({
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  }, { timestamps: true });
  
  module.exports = User.discriminator('Pharmacist', pharmacistSchema);