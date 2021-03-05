import { QueryOrder } from "mikro-orm";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../auth/isAuth";
import { thought } from "../entities/thought.entity";
import { MyContext } from "../types";

@Resolver()
export class ThoughtResolver {
  @Query(() => [thought])
  getThoughts(@Ctx() { em }: MyContext): Promise<thought[]> {
    return em.find(thought, {}, { orderBy: { updatedAt: QueryOrder.DESC } });
  }

  @Query(() => thought, { nullable: true })
  getThought(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<thought | null> {
    return em.findOne(thought, { id });
  }

  @Mutation(() => thought)
  @UseMiddleware(isAuth)
  async setThought(
    @Arg("thoughtContent") thoughtContent: string,
    @Arg("userID") userID: number,
    @Ctx() { em }: MyContext
  ) {
    const thoughtObject = em.create(thought, {
      thought: thoughtContent,
      userID,
    });
    await em.persistAndFlush(thoughtObject);
    return thoughtObject;
  }

  @Mutation(() => thought, { nullable: true })
  @UseMiddleware(isAuth)
  async addLike(
    @Arg("id") id: number,
    @Arg("userID") userID: number,
    @Ctx() { em }: MyContext
  ) {
    const thoughtObject = await em.findOne(thought, { id });
    if (!thoughtObject) return null;
    console.log(thoughtObject.likes.includes(userID));
    if (thoughtObject.likes.includes(userID)) {
      const index = thoughtObject.likes.findIndex((item) => item === userID);
      console.log(index);
      thoughtObject.likes.splice(index, 1);
      console.log(thoughtObject);
    } else {
      thoughtObject.likes.push(userID);
    }
    await em.persistAndFlush(thoughtObject);
    return thoughtObject;
  }

  @Mutation(() => thought, { nullable: true })
  @UseMiddleware(isAuth)
  async updateThought(
    @Arg("id") id: number,
    @Arg("thoughtContent", () => String, { nullable: true })
    thoughtContent: string,
    @Ctx() { em }: MyContext
  ) {
    const thoughtObject = await em.findOne(thought, { id });
    if (!thoughtObject) return null;
    if (thoughtContent) thoughtObject.thought = thoughtContent;
    await em.persistAndFlush(thoughtObject);
    return thoughtObject;
  }
}
