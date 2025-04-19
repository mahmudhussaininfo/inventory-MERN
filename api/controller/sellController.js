import ParentSell from "../model/Sell.js";
import ChildSell from "../model/SellProduct.js";
import mongoose from "mongoose";

// create sell parant & child
export const createSell = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { parentData, childData } = req.body;
    const { email } = req.user;

    const parentPayload = {
      ...parentData,
      userEmail: email,
    };

    const [parentCreated] = await ParentSell.create([parentPayload], {
      session,
    });

    // second database for childSell
    const child = [];

    for (const items in childData) {
      const childPayload = {
        ...items,
        sellId: parentCreated._id,
        userEmail: email,
      };

      const [childCreated] = await ChildSell.create([childPayload], {
        session,
      });

      child.push(childCreated);
    }

    // Transection success
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: "success",
      message: "sell Created successfully",
      parentSell: parentCreated,
      chilSell: child,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      status: "faild",
      message: error.message,
    });
  }
};
