import { register, login } from './authService';

register('anotheremail@gmail.com', 'password')
  .then((user) => {
    console.log('registered user:', user);
  });


login('randomemail@gmail.com', 'mysecretpassword')
  .then((user) => {
    console.log('login user:', user);
  });
