import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const title = body.title;
  const content = body.content.split("<p><br></p>").filter((el) => el);
  res.status(200).json({ title, content });
  res.end();
}
