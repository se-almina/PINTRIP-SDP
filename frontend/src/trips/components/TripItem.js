import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './TripItem.css';

const TripItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`http://localhost:4000/api/trips/${props.id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + auth.token,
      });
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are you sure?'
        footerClass='trip-item__modal-actions'
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this trip? Please note that it can't be undone thereafter.</p>
      </Modal>
      <li className='trip-item'>
        <Card className='trip-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='trip-item__image'>
            <img src={`http://localhost:4000/${props.image}`} alt={props.title} />
          </div>
          <div className='trip-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.location}</h3>
            <p>{props.description}</p>
          </div>
          <div className='trip-item__actions'>
            {auth.userId === props.creatorId && <Button to={`/trips/${props.id}`}>EDIT</Button>}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default TripItem;
