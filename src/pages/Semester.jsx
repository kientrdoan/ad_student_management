import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  DatePicker,
  Select,
  Popconfirm,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  addSemesterAction,
  deleteSemesterAction,
  editSemesterAction,
  getAllSemesterAction,
} from "../redux/actions/SemesterAction";

export default function Semester() {
  const dispatch = useDispatch();
  const semesters = useSelector((state) => state.SemesterReducer.semesters);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getAllSemesterAction());
  }, [dispatch]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        start_date: values.start_date
          ? values.start_date.format("YYYY-MM-DD")
          : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
      };

      if (editingRecord) {
        let newValues = { ...editingRecord, ...formattedValues };
        const res = await dispatch(
          editSemesterAction(editingRecord.id, newValues)
        );
        if (res.success) {
          message.success("Edit semester successfully!");
          dispatch(getAllSemesterAction());
        } else {
          message.error("Failed to edit semester!");
        }
      } else {
        const res = await dispatch(addSemesterAction(formattedValues));
        if (res.success) {
          message.success("Add semester successfully!");
          dispatch(getAllSemesterAction());
        } else {
          message.error("Failed to add semester!");
        }
      }
      setIsModalVisible(false);
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteSemesterAction(id));
    if (res.success) {
      message.success("Xoá semester thành công!");
      dispatch(getAllSemesterAction());
    } else {
      message.error("Xoá thất bại!");
    }
  };

  // --- Columns ---
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: "Semester", dataIndex: "semesters", key: "semesters" },
    { title: "Start date", dataIndex: "start_date", key: "start_date" },
    { title: "End date", dataIndex: "end_date", key: "end_date" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Bạn có chắc muốn xoá student này?'
            okText='OK'
            cancelText='Hủy'
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type='link' danger>
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
        <Button type='primary' onClick={showAddModal}>
          Add Semester
        </Button>
      </Space>

      <Table columns={columns} dataSource={semesters} rowKey='id' bordered />

      <Modal
        title={editingRecord ? "Edit Semester" : "Add Semester"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText='Save'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='year'
            name='year'
            rules={[
              {
                required: true,
                message: "Please input year!",
              },
            ]}
          >
            <Input min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label='Semester'
            name='semesters'
            rules={[{ required: true, message: "Please select semester!" }]}
          >
            <Select placeholder='Select semester'>
              <Select.Option value='Học kỳ 1'>Học kỳ 1</Select.Option>
              <Select.Option value='Học kỳ 2'>Học kỳ 2</Select.Option>
              <Select.Option value='Học kỳ 3'>Học kỳ 3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Start date'
            name='start_date'
            rules={[{ required: true, message: "Please select start date!" }]}
          >
            <DatePicker format='YYYY-MM-DD' style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label='End date'
            name='end_date'
            rules={[{ required: true, message: "Please select end date!" }]}
          >
            <DatePicker format='YYYY-MM-DD' style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
