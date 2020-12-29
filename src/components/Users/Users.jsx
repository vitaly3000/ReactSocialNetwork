import React from 'react';
import style from './Users.module.css';
import * as axios from 'axios';
import userPhoto from '../../assets/img/user.jpg';

class Users extends React.Component {
  constructor(props) {
    super(props);
    axios
      .get('https://social-network.samuraijs.com/api/1.0/users')
      .then((responce) => {
        this.props.setUsers(responce.data.items);
      });
  }
  render() {
    return (
      <div className={style.users}>
        {this.props.users.map((u) => {
          return (
            <div className={style.user}>
              <img
                className={style.photo}
                src={u.photo ? u.small : userPhoto}
                alt="a sad frog"
              />
              <div className={style.name}>{u.name}</div>

              <button
                onClick={() => {
                  this.props.toggleFollow(u.id);
                }}>
                {u.followed ? 'Отписаться' : 'Подписаться'}
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
export default Users;
