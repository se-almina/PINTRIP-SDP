const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Trip = require('../models/trip');
const User = require('../models/user');

const getTripById = async (req, res, next) => {
  const tripId = req.params.pid; // { pid: 'p1' }

  let trip;
  try {
    trip = await Trip.findById(tripId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a trip.', 500);
    return next(error);
  }

  if (!trip) {
    const error = new HttpError('Could not find a trip for the provided id.', 404);
    return next(error);
  }

  res.json({ trip: trip.toObject({ getters: true }) });
};

const getTripsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let trips;
  try {
    trips = await Trip.find({ creator: userId });
  } catch (err) {
    const error = new HttpError('Fetching trips failed, please try again later', 500);
    return next(error);
  }

  if (!trips || trips.length === 0) {
    return next(new HttpError('Could not find trips for the provided user id.', 404));
  }

  res.json({ trips: trips.map((trip) => trip.toObject({ getters: true })) });
};

const createTrip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, location } = req.body;

  const createdTrip = new Trip({
    title,
    description,
    location,
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError('Creating trip failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTrip.save({ session: sess });
    user.trips.push(createdTrip);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating trip failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ trip: createdTrip });
};

const updateTrip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description } = req.body;
  const tripId = req.params.pid;

  let trip;
  try {
    trip = await Trip.findById(tripId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update trip.', 500);
    return next(error);
  }

  if (trip.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this trip.', 401);
    return next(error);
  }

  trip.title = title;
  trip.description = description;

  try {
    await trip.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update trip.', 500);
    return next(error);
  }

  res.status(200).json({ trip: trip.toObject({ getters: true }) });
};

const deleteTrip = async (req, res, next) => {
  const tripId = req.params.pid;
  console.log(tripId);

  let trip;
  try {
    trip = await Trip.findById(tripId);
    await trip.populate('creator');
    console.log(trip);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete trip.', 500);
    return next(error);
  }

  if (!trip) {
    const error = new HttpError('Could not find trip for this id.', 404);
    return next(error);
  }

  if (trip.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this trip.', 401);
    return next(error);
  }

  const imagePath = trip.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await trip.deleteOne({ session: sess });
    trip.creator.trips.pull(trip);
    await trip.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Something went wrong, could not delete trip.', 500);
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted trip.' });
};

exports.getTripById = getTripById;
exports.getTripsByUserId = getTripsByUserId;
exports.createTrip = createTrip;
exports.updateTrip = updateTrip;
exports.deleteTrip = deleteTrip;
