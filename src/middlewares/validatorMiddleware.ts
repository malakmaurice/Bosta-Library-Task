import express from "express";

export const validateRequest = (schema: any, type: any) => {
  return (req: any, res: express.Response, next: express.NextFunction) => {
    const { error } = schema.validate(req[type]);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((e: any) => e.message).join(",");
      console.log("error", message);
      res.status(422).json({ error: message });
    }
  };
};
