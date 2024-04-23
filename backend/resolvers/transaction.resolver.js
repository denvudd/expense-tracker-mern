import Transaction from "../models/transaction.model.js";

export const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Not authorized");
        }

        const user = await context.getUser();
        const transactions = await Transaction.find({ userId: user._id });

        return transactions;
      } catch (error) {
        console.error("Error getting transactions:", error);
        throw new Error("Error getting transactions");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);

        return transaction;
      } catch (error) {
        console.error("Error getting transactions:", error);
        throw new Error("Error getting transaction");
      }
    },

    categoryStatistics: async (_, __, context) => {
      const user = await context.getUser();

      if (!user) throw new Error("Not authorized");

      const transactions = await Transaction.find({ userId: user._id });
      const categoryMap = {};

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }

        categoryMap[transaction.category] += transaction.amount;
      });

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const user = await context.getUser();
        const newTransaction = new Transaction({
          ...input,
          userId: user._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error("Error getting transactions:", error);
        throw new Error("Error creating transactions");
      }
    },

    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );

        return updatedTransaction;
      } catch (error) {
        console.error("Error getting transactions:", err);
        throw new Error("Error updating transactions");
      }
    },

    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );

        return deletedTransaction;
      } catch (error) {
        console.error("Error getting transactions:", err);
        throw new Error("Error deleting transactions");
      }
    },
  },
};
