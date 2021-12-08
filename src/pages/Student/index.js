import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { FaUserCircle, FaEdit } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import axios from '../../services/axios';
import history from '../../services/axios';

import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';

import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Student({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', '');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/students/${id}`);
        const Photo = get(data, 'Photos[0].url', '');

        setPhoto(Photo);

        setFirstName(data.firstname);
        setLastName(data.lastname);
        setEmail(data.email);
        setAge(data.age);
        setWeight(data.weight);
        setHeight(data.height);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) {
          errors.map((error) => toast.error(error));
          history.push('/');
        }
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = '';

    if (firstName.length < 3 || firstName.length > 255) {
      toast.error('FirstName must have between 3 and 255 chars');
      formErrors = true;
    }

    if (lastName.length < 3 || lastName.length > 255) {
      toast.error('LastName must have between 3 and 255 chars');
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('Invalid Email');
      formErrors = true;
    }

    if (!isInt(String(age))) {
      toast.error('Invalid Age');
      formErrors = true;
    }

    if (!isFloat(String(weight))) {
      toast.error('Invalid Weight');
      formErrors = true;
    }

    if (!isFloat(String(height))) {
      toast.error('Invalid Height');
      formErrors = true;
    }

    if (formErrors) return;

    try {
      setIsLoading(true);

      if (id) {
        await axios.put(`/students/${id}`, {
          firstname: firstName,
          lastname: lastName,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student updated successfully!');
      } else {
        const { data } = await axios.post(`/students/`, {
          firstname: firstName,
          lastname: lastName,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student created successfully!');
        history.push(`/student/${data.id}/edit`);
      }

      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Unknown Error');
      }

      if (status === 401) {
        dispatch(actions.loginFailure());
      }
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>{id ? 'Edit Student' : 'New Student'}</Title>

      {id && (
        <ProfilePicture>
          {photo ? (
            <img src={photo} alt={firstName} />
          ) : (
            <FaUserCircle size={180} />
          )}
          <Link to={`/photos/${id}`}>
            <FaEdit size={18} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
        />
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
        />

        <button type="submit">Send</button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
