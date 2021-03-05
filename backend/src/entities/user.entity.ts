import { Entity, Property, PrimaryKey, ArrayType } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  userID!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  username!: string;

  @Field()
  @Property({ type: "string" })
  password!: string;

  @Field(() => Number)
  @Property({ type: Number })
  tokenVersion = 0;
}