import Item from "../../models/items.model.js";

export default async function findItem(req, res) {
  const item = req.body.Item;
  try {
    const items = await Item.find({
        $or: [
          { ItemName: { $regex: item, $options: 'i' } },
          { TypeOfDish: { $regex: item, $options: 'i' } }
        ]
      });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(404).json({ message: error.message,success:false });
  }
}
