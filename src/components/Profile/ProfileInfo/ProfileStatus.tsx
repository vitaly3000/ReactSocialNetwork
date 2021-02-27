import React, { useState, useEffect, ChangeEvent } from 'react';
type PropsType = {
  status: string;
  updateStatus: (newStatus: string) => void;
};

const ProfileStatus: React.FC<PropsType> = (props) => {
  let [editMode, setEditMode] = useState(false);
  let [status, setStatus] = useState(props.status);
  let activateEditMode = () => {
    setEditMode(true);
  };
  let deactivateEditMode = (e: ChangeEvent<HTMLInputElement>) => {
    setEditMode(false);
    if (e.currentTarget.value) {
      props.updateStatus(status);
    }
  };
  let onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.currentTarget.value);
  };
  useEffect(() => {
    setStatus(props.status);
  }, [props.status]);
  return (
    <div>
      {editMode ? (
        <input
          autoFocus
          onChange={onStatusChange}
          onBlur={deactivateEditMode}
          value={status}
        />
      ) : (
        <span onClick={activateEditMode}>
          {status ? status : 'Введите статус'}
        </span>
      )}
    </div>
  );
};
// class ProfileStatus extends React.Component {
//   state = {
//     editMode: false,
//     status: this.props.status,
//   };
//   activateEditMode = () => {
//     this.setState({
//       editMode: true,
//     });
//   };
//   deactivateEditMode = (e) => {
//     this.setState({
//       editMode: false,
//     });
//     if (e.currentTarget.value) {
//       this.props.updateStatus(this.state.status);
//     }
//   };
//   onStatusChange = (e) => {
//     this.setState({
//       status: e.currentTarget.value,
//     });
//   };
//   componentDidUpdate(prevProps, prevState) {
//     if (prevProps.status !== this.props.status) {
//       this.setState({
//         status: this.props.status,
//       });
//     }
//   }
//   render() {
//     return (
//       <div>
//         {this.state.editMode ? (
//           <input
//             autoFocus
//             onChange={this.onStatusChange}
//             onBlur={this.deactivateEditMode}
//             value={this.state.status}
//           />
//         ) : (
//           <span onClick={this.activateEditMode}>
//             {this.props.status ? this.props.status : 'Введите статус'}
//           </span>
//         )}
//       </div>
//     );
//   }
// }
export default ProfileStatus;