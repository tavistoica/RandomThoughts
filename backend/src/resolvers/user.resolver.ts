import { QueryOrder } from "mikro-orm";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/user.entity";
import { MyContext } from "../types";
import { hash, compare } from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../auth/auth";
import { sendRefreshToken } from "../auth/sendRefreshToken";
import { thought } from "../entities/thought.entity";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken!: string;
  @Field(() => User)
  user!: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  getUsers(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {}, { orderBy: { updatedAt: QueryOrder.DESC } });
  }

  @Query(() => User, { nullable: true })
  getUser(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { userID: id });
  }

  @Query(() => [thought], { nullable: true })
  getUserThoughts(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<thought[]> {
    return em.find(thought, { userID: id });
  }

  @Mutation(() => Boolean)
  async registerUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ) {
    try {
      const user = await em.findOne(User, { username });
      if (user) return false;
      const hashedPassword = await hash(password, 12);
      const userObject = em.create(User, {
        username,
        password: hashedPassword,
      });
      await em.persistAndFlush(userObject);
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  @Mutation(() => LoginResponse)
  async loginUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em, res }: MyContext
  ) {
    const user = await em.findOne(User, { username });
    if (!user) throw new Error("could not find user");

    const valid = await compare(password, user.password);
    if (!valid) throw new Error("Password is incorrect");

    console.log("refresh token", createRefreshToken(user));
    sendRefreshToken(res, createRefreshToken(user));

    return { accessToken: createAccessToken(user), user };
  }

  @Mutation(() => Boolean)
  async logoutUser(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");

    return true;
  }
}
