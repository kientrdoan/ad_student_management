import React, { useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudentAction } from "../redux/actions/StudentAction";
import { Link } from "react-router-dom";

export default function Student() {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.StudentReducer.students);

  useEffect(() => {
    dispatch(getAllStudentAction());
  }, [dispatch]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Student Code",
      dataIndex: "student_code",
      key: "student_code",
    },
    {
      title: "Class",
      dataIndex: "classes",
      key: "classes",
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.user?.email || "N/A",
    },
    {
      title: "First Name",
      key: "first_name",
      render: (_, record) => record.user?.first_name || "N/A",
    },
    {
      title: "Last Name",
      key: "last_name",
      render: (_, record) => record.user?.last_name || "N/A",
    },
    {
      title: "Role",
      key: "role",
      render: (_, record) => record.user?.role || "N/A",
    },
    {
      title: "Active",
      key: "is_active",
      render: (_, record) => (record.user?.is_active ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {/* <Button type="link" onClick={() => message.info(`Edit ${record.id}`)}>
            Edit
          </Button> */}
          <Button
            type="link"
            danger
            onClick={() => message.info(`Delete ${record.id}`)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Link to="/students/detail" type="primary">Add Student</Link >
      </Space>
      <Table
        bordered
        columns={columns}
        dataSource={students}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
