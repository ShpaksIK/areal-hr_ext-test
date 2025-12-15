import { createEntity } from "./entities";

try {
  const result = createEntity('user', {
    id: -1,
    last_name: 'Иванов',
    first_name: 'Иван',
    patronymic: 'Иванович',
    login: 'admin',
    password: 'admin',
    role_id: 1,
  });
  console.log(result);
} catch (error) {
  console.error(error);
}