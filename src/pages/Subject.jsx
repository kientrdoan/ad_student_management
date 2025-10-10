/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

import { getAllMajorAction } from "../redux/actions/MajorAction";
import { getAllSubjectAction } from "../redux/actions/SubjectAction";
import { Link } from "react-router-dom";

export default function Subject() {
  const dispatch = useDispatch();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const subjects = useSelector((state) => state.SubjectReducer.subjects);

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);
//   const [form] = Form.useForm();

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllMajorAction());
      await dispatch(getAllSubjectAction());
    };
    loadData();
  }, [dispatch]);

//   const showAddModal = () => {
//     setEditingRecord(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   const showEditModal = (record) => {
//     setEditingRecord(record);
//     form.setFieldsValue(record);
//     setIsModalVisible(true);
//   };

//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       let res;

//       if (editingRecord) {
//         res = await dispatch(editSubjectAction({ ...editingRecord, ...values }));
//       } else {
//         res = await dispatch(addSubjectAction(values));
//       }

//       if (res?.success) {
//         message.success(
//           `${editingRecord ? "Update" : "Add"} subject successfully!`
//         );
//         dispatch(getAllSubjectAction());
//         setIsModalVisible(false);
//       } else {
//         message.error("Action failed!");
//       }
//     } catch (err) {
//       console.log("Validate Failed:", err);
//     }
//   };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Credit", dataIndex: "credit", key: "credit" },
    { title: "Total Period", dataIndex: "total_period", key: "total_period" },
    // { title: "Theory Period", dataIndex: "theory_period", key: "theory_period" },
    // { title: "Lab Period", dataIndex: "lab_period", key: "lab_period" },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      render: (id) => {
        const major = majors.find((m) => String(m.id) === String(id));
        return major ? major.name : "N/A";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/subjects/detail/${record.id}`}>
            Edit
        </Link>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Link to="/subjects/detail">
          Add Subject
        </Link>
      </Space>

      <Table
        columns={columns}
        dataSource={subjects}
        rowKey={(r) => r.id}
        bordered
        pagination={{ pageSize: 8 }}
      />

      {/* <Modal
        title={editingRecord ? "Edit Subject" : "Add Subject"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Please input subject code!" }]}
          >
            <Input placeholder="e.g. CS101" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input subject name!" }]}
          >
            <Input placeholder="e.g. Introduction to Programming" />
          </Form.Item>

          <Form.Item
            label="Credit"
            name="credit"
            rules={[{ required: true, message: "Please input credit!" }]}
          >
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Enter course description..." />
          </Form.Item>

          <Form.Item
            label="Total Period"
            name="total_period"
            rules={[{ required: true, message: "Please input total period!" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Theory Period"
            name="theory_period"
            rules={[{ required: true, message: "Please input theory period!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Lab Period"
            name="lab_period"
            rules={[{ required: true, message: "Please input lab period!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Major"
            name="major"
            rules={[{ required: true, message: "Please select major!" }]}
          >
            <Select placeholder="Select major">
              {majors?.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
}
