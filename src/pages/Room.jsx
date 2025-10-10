import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

import dayjs from "dayjs";
import {
  addRoomAction,
  editRoomAction,
  getAllRoomAction,
} from "../redux/actions/RoomAction";

export default function Room() {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.RoomReducer.rooms);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // --- Load list rooms ---
  useEffect(() => {
    dispatch(getAllRoomAction());
  }, [dispatch]);

  // --- Open modal Add ---
  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // --- Open modal Edit ---
  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // --- Handle Save ---
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        let newValues = { ...editingRecord, ...values };
        console.log("Edit room:", newValues);
        const res = await dispatch(editRoomAction(editingRecord.id, newValues));
        console.log("res edit", res);
        if (res.success) {
          message.success("Edit room successfully!");
          dispatch(getAllRoomAction());
        } else {
          message.error("Failed to edit room!");
        }
      } else {
        // Gọi API add
        const res = await dispatch(addRoomAction(values));
        if (res.success) {
          message.success("Add room successfully!");
          dispatch(getAllRoomAction()); // refresh list
        } else {
          message.error("Failed to add room!");
        }
      }
      setIsModalVisible(false);
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  // --- Columns ---
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Room code", dataIndex: "room_code", key: "room_code" },
    { title: "Building", dataIndex: "building", key: "building" },
    { title: "Max capacity", dataIndex: "max_capacity", key: "max_capacity" },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) =>
        text ? dayjs(text).format("DD/MM/YYYY HH:mm:ss") : "N/A",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) =>
        text ? dayjs(text).format("DD/MM/YYYY HH:mm:ss") : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type='link' onClick={() => showEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type='primary' onClick={showAddModal}>
          Add Room
        </Button>
      </Space>

      <Table columns={columns} dataSource={rooms} rowKey='id' bordered />

      <Modal
        title={editingRecord ? "Edit Room" : "Add Room"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText='Save'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Room code'
            name='room_code'
            rules={[{ required: true, message: "Please input room code!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Building'
            name='building'
            rules={[{ required: true, message: "Please input building!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Max Capacity'
            name='max_capacity'
            rules={[{ required: true, message: "Please input max capacity!" }]}
          >
            <Input type='number' min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
