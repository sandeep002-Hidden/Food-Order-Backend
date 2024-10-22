import Item from "../../models/items.model.js";
export default async function getItems(req, res) {
  try {
    console.log("get Items")
    const items = await Item.find();
    return res.status(200).json({ Item: items,message:"successfully got the Items",success:false });
  } catch (error) {
    return res.status(500).json({ message:error.message,success:false });
  }
}