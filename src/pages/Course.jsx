import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
// import dayjs from "dayjs";
import {
  addCourseAction,
  editCourseAction,
  getAllCourseAction,
} from "../redux/actions/CourseAction";
import { getAllSemesterAction } from "../redux/actions/SemesterAction";
import { getAllClassAction } from "../redux/actions/ClassAction";
import { getAllTeacherAction } from "../redux/actions/TeacherAction";
import { getAllSubjectAction } from "../redux/actions/SubjectAction";
import { getAllRoomAction } from "../redux/actions/RoomAction";

export default function Course() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.CourseReducer.courses);
  const semesters = useSelector((state) => state.SemesterReducer.semesters);
  const classes = useSelector((state) => state.ClassReducer.classes);
  const teachers = useSelector((state) => state.TeacherReducer.teachers);
  const subjects = useSelector((state) => state.SubjectReducer.subjects);
   const rooms = useSelector((state) => state.RoomReducer.rooms);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // --- Load all data ---
  useEffect(() => {
    dispatch(getAllCourseAction());
    dispatch(getAllSemesterAction());
    dispatch(getAllClassAction());
    dispatch(getAllTeacherAction());
    dispatch(getAllSubjectAction());
    dispatch(getAllRoomAction());
  }, [dispatch]);

  // --- Open Add Modal ---
  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // --- Open Edit Modal ---
  const showEditModal = (record) => {
    setEditingRecord(record);

    form.setFieldsValue({
      semester: record.semester?.id,
      class_st: record.class_st?.id,
      teacher: record.teacher?.id,
      subject: record.subject?.id,
      room: record.room?.id,
      max_capacity: record.max_capacity,
    });

    setIsModalVisible(true);
  };

  // --- Handle Save ---
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // map lại đúng cấu trúc backend yêu cầu
      // const payload = {
      //   semester: { id: values.semester },
      //   class_st: { id: values.class_st },
      //   instructor: { id: values.instructor },
      //   subject: { id: values.subject },
      //   max_capacity: values.max_capacity,
      // };

      let res;
      if (editingRecord) {
        res = await dispatch(editCourseAction(editingRecord.id, values));
      } else {
        res = await dispatch(addCourseAction(values));
      }

      if (res.success) {
        message.success(
          editingRecord
            ? "Edit course successfully!"
            : "Add course successfully!"
        );
        dispatch(getAllCourseAction());
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error("Failed to save course!");
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  // --- Handle Cancel ---
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // --- Columns ---
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      render: (semester) => semester?.semesters || "N/A",
    },
    {
      title: "Class",
      dataIndex: "class_st",
      key: "class_st",
      render: (class_st) => class_st?.name || "N/A",
    },
    {
      title: "Teacher",
      dataIndex: "teacher",
      key: "teacher",
      render: (instructor) => instructor?.name || "N/A",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => subject?.name || "N/A",
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      render: (room) => room?.room_code || "N/A",
    },
    {
      title: "Max Capacity",
      dataIndex: "max_capacity",
      key: "max_capacity",
    },
    // {
    //   title: "Created At",
    //   dataIndex: "created_at",
    //   key: "created_at",
    //   render: (text) =>
    //     text ? dayjs(text).format("DD/MM/YYYY HH:mm:ss") : "N/A",
    // },
    // {
    //   title: "Updated At",
    //   dataIndex: "updated_at",
    //   key: "updated_at",
    //   render: (text) =>
    //     text ? dayjs(text).format("DD/MM/YYYY HH:mm:ss") : "N/A",
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showAddModal}>
          Add Course
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        bordered
        pagination={{ pageSize: 6 }}
      />

      <Modal
        title={editingRecord ? "Edit Course" : "Add Course"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Semester"
            name="semester"
            rules={[{ required: true, message: "Please select semester!" }]}
          >
            <Select placeholder="Select semester">
              {semesters?.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.semesters}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Class"
            name="class_st"
            rules={[{ required: true, message: "Please select class!" }]}
          >
            <Select placeholder="Select class">
              {classes?.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Teacher"
            name="teacher"
            rules={[{ required: true, message: "Please select teacher!" }]}
          >
            <Select placeholder="Select teacher">
              {teachers?.map((i) => (
                <Select.Option key={i.id} value={i.id}>
                  {i.user.first_name} {i.user.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item
            label="Room"
            name="room"
            rules={[{ required: true, message: "Please select room!" }]}
          >
            <Select placeholder="Select room">
              {rooms?.map((i) => (
                <Select.Option key={i.id} value={i.id}>
                  {i.room_code} - {i.building}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please select subject!" }]}
          >
            <Select placeholder="Select subject">
              {subjects?.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Max Capacity"
            name="max_capacity"
            rules={[{ required: true, message: "Please input max capacity!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
