import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editDepartmentAction, getAllAction } from "../redux/actions/DepartmentsAction";
import { addDepartmentAction } from "../redux/actions/DepartmentsAction";

export default function Department() {
  const dispatch = useDispatch();
  const departments = useSelector(
    (state) => state.DepartmentReducer.departments
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // --- Load list departments ---
  useEffect(() => {
    dispatch(getAllAction());
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
        let newValues = { ...editingRecord, ...values }
        console.log("Edit department:", newValues);
        const res = await dispatch(editDepartmentAction(newValues));
        console.log("res edit", res);
        if (res.success) {
          message.success("Edit department successfully!");
          dispatch(getAllAction());
        } else {
          message.error("Failed to edit department!");
        }
      } else {
        // Gọi API add
        const res = await dispatch(addDepartmentAction(values));
        if (res.success) {
          message.success("Add department successfully!");
          dispatch(getAllAction()); // refresh list
        } else {
          message.error("Failed to add department!");
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
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
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
          Add Department
        </Button>
      </Space>

      <Table columns={columns} dataSource={departments} rowKey="id" bordered />

      <Modal
        title={editingRecord ? "Edit Department" : "Add Department"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Please input code!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
