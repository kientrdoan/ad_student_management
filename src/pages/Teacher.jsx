/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {  deleteTeacherAction, getAllTeacherAction } from "../redux/actions/TeacherAction";
import { Link } from "react-router-dom";

export default function Teacher() {
  const dispatch = useDispatch();
  const teachers = useSelector((state) => state.TeacherReducer.teachers);
    // 👉 dữ liệu đang edit


  useEffect(() => {
    dispatch(getAllTeacherAction());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const res = await dispatch(deleteTeacherAction(id));
    if (res.success) {
      message.success("Xoá student thành công!");
      dispatch(getAllTeacherAction()); // reload danh sách
    } else {
      message.error("Xoá thất bại!");
    }
  };



  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Last Name", render: (_, r) => r.user?.last_name || "N/A" },
    { title: "First Name", render: (_, r) => r.user?.first_name || "N/A" },
    { title: "Email", render: (_, r) => r.user?.email || "N/A" },
    { title: "Phone", render: (_, r) => r.user?.phone || "N/A" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Link to={`/teachers/detail/${record.id}`}>Edit </Link>
           <Popconfirm
            title="Bạn có chắc muốn xoá student này?"
            okText="OK"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Link to="/teachers/detail">Add Teacher</Link>
      </Space>

      <Table
        bordered
        columns={columns}
        dataSource={teachers}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />

    </div>
  );
}
