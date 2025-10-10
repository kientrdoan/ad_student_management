import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

import { getAllMajorAction } from "../redux/actions/MajorAction";
import {
  addClassAction,
  editClassAction,
  getAllClassAction,
} from "../redux/actions/ClassAction";

import dayjs from "dayjs";

export default function Class() {
  const dispatch = useDispatch();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const classes = useSelector((state) => state.ClassReducer.classes);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllMajorAction());
      await dispatch(getAllClassAction());
    };
    loadData();
  }, [dispatch]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      major: record.major,
      start_year: record.start_year,
      end_year: record.end_year,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let res;
      if (editingRecord) {
        res = await dispatch(editClassAction({ ...editingRecord, ...values }));
      } else {
        console.log("Add class:", values);
        res = await dispatch(addClassAction(values));
      }
      if (res?.success) {
        message.success(
          `${editingRecord ? "Update" : "Add"} class successfully!`
        );
        dispatch(getAllClassAction());
        setIsModalVisible(false);
      } else {
        message.error("Action failed!");
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      render: (id) => {
        const major = majors.find((m) => String(m.id) === String(id));
        return major ? major.name : "N/A";
      },
    },
    { title: "Start Year", dataIndex: "start_year", key: "start_year" },
    { title: "End Year", dataIndex: "end_year", key: "end_year" },
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
          Add Class
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={classes}
        rowKey={(r) => r.id}
        bordered
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingRecord ? "Edit Class" : "Add Class"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText='Save'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Class Name'
            name='name'
            rules={[{ required: true, message: "Please input class name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Major'
            name='major'
            rules={[{ required: true, message: "Please select major!" }]}
          >
            <Select placeholder='Select major'>
              {majors?.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label='Start Year'
            name='start_year'
            rules={[{ required: true, message: "Please input start year!" }]}
          >
            <Input type='number' />
          </Form.Item>

          <Form.Item
            label='End Year'
            name='end_year'
            rules={[{ required: true, message: "Please input end year!" }]}
          >
            <Input type='number' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
