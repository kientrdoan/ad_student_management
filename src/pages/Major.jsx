import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select, Space, message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllAction } from "../redux/actions/DepartmentsAction";
import { addMajorAction, getAllMajorAction } from "../redux/actions/MajorAction";

export default function Major() {
  const dispatch = useDispatch();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const departments = useSelector((state) => state.DepartmentReducer.departments);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Load dữ liệu
  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllAction());
      await dispatch(getAllMajorAction());
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
      department: record.department,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        // TODO: Update major
        console.log("Update major:", { ...editingRecord, ...values });
      } else {
        console.log("Add major:", values);
        const res = await dispatch(addMajorAction(values));
        if (res.success) {
          message.success("Add major successfully!");
          dispatch(getAllMajorAction());
        } else {
          message.error("Failed to add major!");
        }
      }
      setIsModalVisible(false);
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (deptId) => {
        const dept = departments.find((d) => String(d.id) === String(deptId));
        return dept ? dept.name : "N/A";
      },
    },
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
          Add Major
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={majors}
        rowKey={(record) => record.id}
        bordered
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingRecord ? "Edit Major" : "Add Major"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department!" }]}
          >
            <Select placeholder="Select department">
              {departments.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
