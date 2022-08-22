import { Repository } from "typeorm";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

export class CustomRep extends Repository<User> {
  findByName(firstName: string, lastName: string) {
    // this.createQueryBuilder34333;
    return this.createQueryBuilder("user")
      .where("user.firstName = :firstName", { firstName })
      .andWhere("user.lastName = :lastName", { lastName })
      .getMany();
  }
}

export const userRepository = AppDataSource.getRepository(User).extend(
  new CustomRep(User, AppDataSource.manager, AppDataSource.manager.queryRunner)
);

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await AppDataSource.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
    console.log(await userRepository.findByName("Timber", "Saw"));
  })
  .catch((error) => console.log(error));
