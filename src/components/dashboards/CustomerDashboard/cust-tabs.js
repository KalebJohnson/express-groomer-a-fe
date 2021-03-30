import { Alert, Row, Tabs, Card, Button } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import CustomerProfilePage from '../../profiles/CustomerProfile/CustProContainer';
import { ProfileFormPO } from '../../forms/CustomerProfileForm';
import AddPetForm from '../../forms/PetForm/AddPetForm';
import { FormContext } from '../../../state/contexts/FormContext';
import FileUpload from '../../common/FileUpload';
import { CustomersContext } from '../../../state/contexts/CustomersContext';
import { APIContext } from '../../../state/contexts/APIContext';
import { useOktaAuth } from '@okta/okta-react';

const { TabPane } = Tabs;

// this will need to be deleted and pet, setPet will be used instead once
// hooked up
const pet = {};

const CustTab = () => {
  const { authState } = useOktaAuth();
  // const [pet, setPet] = useState();
  const [mode] = useState('left');
  // context state
  const { resultInfo } = useContext(FormContext);
  const { custInfo, customerAppointments, customerFavorites } = useContext(
    CustomersContext
  );
  const {
    getCustomerByID,
    getCustomerAppointments,
    editCustomerAppointmentConfirmation,
    getCustomerFavorites,
  } = useContext(APIContext);

  const [click, setClick] = useState(0);

  var month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  useEffect(() => {
    getCustomerByID(authState);
    getCustomerAppointments();
    getCustomerFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [click]);

  return (
    <div>
      <Tabs
        defaultActiveKey="0"
        tabPosition={mode}
        style={{ height: '100%', marginLeft: '5%' }}
      >
        <TabPane
          tab={
            <span>
              <i className="fas fa-paw"></i>
              {` `}
              {` My Info`}
            </span>
          }
          key="1"
        >
          <Row justify={'center'} style={{ marginLeft: '-10%' }}>
            <ProfileFormPO />
          </Row>
          <Row justify={'center'} style={{ height: '60px' }}>
            {resultInfo.message !== null ? (
              <Alert
                message={resultInfo.message}
                type={resultInfo.type}
                showIcon
                style={{ marginTop: '20px', height: '40px' }}
              />
            ) : null}
          </Row>
          <div style={{ marginTop: '-8%', marginLeft: '-10%' }}>
            <CustomerProfilePage />
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <i className="fas fa-paw"></i> My Pets
            </span>
          }
          key="2"
        >
          <Row justify={'center'}>
            <AddPetForm />
          </Row>
          <Row justify={'center'}>
            <h2 style={{ marginTop: '10px' }}>Upload Pet Image</h2>
          </Row>
          <Row justify={'center'}>
            <FileUpload
              /* logic will need to be added to get a pet from API for this
               to be functional */
              uploadUrl={`pets/image-upload/${pet && pet.id}?customer_id=${
                custInfo.user_id
              }`}
            />
          </Row>
          <Row justify={'center'}>
            <h2 style={{ marginTop: '10px' }}>Upload Pet Vaccination Image</h2>
          </Row>
          <Row justify={'center'}>
            <FileUpload
              /* logic will need to be added to get a pet from API for this
               to be functional */
              uploadUrl={`pets/vaccination-upload/${pet &&
                pet.id}?customer_id=${custInfo.user_id}`}
            />
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <i className="fas fa-paw"></i> Appointments
            </span>
          }
          key="3"
        >
          <h2 style={{ margin: '2%' }}>Upcoming Appointments:</h2>
          <br />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {customerAppointments !== undefined ? (
              customerAppointments.map(info => {
                let canceled = {
                  confirmation: 'canceled',
                  transaction_id: info.transaction,
                };
                return (
                  <div key={info.transaction} style={{ margin: '2%' }}>
                    <Card
                      hoverable
                      title={`${info.business_name}`}
                      extra={`${info.confirmation}`}
                      style={{ width: 375, border: 'solid 0.8px black' }}
                    >
                      <h3>Certified Groomer:</h3>
                      <p>{`${info.given_name} ${info.family_name.slice(
                        0,
                        1
                      )}.`}</p>
                      <h3 style={{ marginTop: '2%' }}>Address:</h3>
                      <p>{info.address}</p>
                      <p
                        style={{ marginTop: '-6%' }}
                      >{`${info.city}, ${info.state} ${info.zip_code}`}</p>
                      <h3 style={{ marginTop: '2%' }}>Date:</h3>
                      <h4 style={{ marginBottom: '-1%', fontStyle: 'italic' }}>
                        Day
                      </h4>

                      <p>
                        {info.date.slice(8, 10)}{' '}
                        {month[info.date.slice(5, 7) - 1]},{' '}
                        {info.date.slice(0, 4)}
                      </p>

                      <h4
                        style={{
                          marginTop: '2%',
                          marginBottom: '-1%',
                          fontStyle: 'italic',
                        }}
                      >
                        Time
                      </h4>
                      <p>
                        {info.startTime.slice(0, 2) === 12
                          ? info.startTime.slice(0, 5) + 'PM'
                          : info.startTime.slice(0, 2) < 12
                          ? info.startTime.slice(0, 5) + 'AM'
                          : info.startTime.slice(0, 2) > 12
                          ? info.startTime.slice(0, 2) -
                            12 +
                            ':' +
                            info.startTime.slice(3, 5) +
                            'PM'
                          : info.startTime.slice(0, 5) + 'PM'}{' '}
                      </p>
                      {info.confirmation !== 'canceled' ? (
                        <div>
                          <h3 style={{ marginTop: '2%' }}>Services:</h3>
                          <p>
                            {info.cart.map(data => {
                              return data;
                            })}
                          </p>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <h3 style={{ marginTop: '2%' }}>Contact:</h3>
                      <h4 style={{ marginBottom: '-2%', fontStyle: 'italic' }}>
                        Email
                      </h4>
                      <a href={`mailto:${info.email}`}> {info.email}</a>
                      <h4
                        style={{
                          marginTop: '2%',
                          marginBottom: '-2%',
                          fontStyle: 'italic',
                        }}
                      >
                        Phone Number
                      </h4>
                      <a
                        href={`tel:${info.phone_number}`}
                        style={{ marginTop: '0%' }}
                      >
                        {info.phone_number}
                      </a>
                      <p></p>
                      {info.confirmation !== 'canceled' ? (
                        <div>
                          <Button style={{ pattingTop: '8%' }}>
                            Reschedule
                          </Button>
                          <Button
                            type="primary"
                            danger
                            onClick={() => {
                              editCustomerAppointmentConfirmation(
                                authState,
                                canceled
                              );
                              setClick(click + 1);
                            }}
                          >
                            Cancel
                          </Button>{' '}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </Card>
                  </div>
                );
              })
            ) : (
              <p>No Appointments</p>
            )}
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <i className="fas fa-paw"></i> Favorite Groomers
            </span>
          }
          key="4"
        >
          <div className="Favorite-Groomers">
            <h1>Favorite Groomers</h1>
            {customerFavorites !== undefined ? (
              customerFavorites.map(info => {
                return (
                  <div key={info.transaction()} style={{ margin: '2%' }}>
                    <Card
                      hoverable
                      title={`${info.business_name}`}
                      style={{ width: 375, border: 'solid 0.8px black' }}
                    ></Card>
                    <button>Remove</button>
                  </div>
                );
              })
            ) : (
              <p>No Favorites</p>
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CustTab;
