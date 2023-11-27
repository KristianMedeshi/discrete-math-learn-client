/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import HTMLReactParser from 'html-react-parser';
import { getCourseBlock } from '../../utils/coursesApi';
import './Course.scss';

function CourseBlock({ id }) {
  const courseId = useParams().id;
  const { data } = useQuery(`${courseId}/${id}`, () => getCourseBlock(courseId, id));
  const { block } = data || {};

  return (
    <div>
      {HTMLReactParser(block?.lecture ?? '')}
    </div>
  );
}

export default CourseBlock;
