import { Entity, Property, PrimaryKey, ArrayType } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class thought {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  thought!: string;

  @Field(() => [Number])
  @Property({ type: new ArrayType<number>() })
  likes: number[] = [];

  @Field(() => Number)
  @Property({ type: "number" })
  userID!: number;
}
