import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Space,
  message,          // vẫn import để dùng hook
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllClassAction } from "../redux/actions/ClassAction";
import { addStudentAction } from "../redux/actions/StudentAction";

export default function StudentAdd() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.ClassReducer.classes); // lấy danh sách class

  // 👉 Tạo hook useMessage
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(getAllClassAction());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    const payload = {
      student_code: values.student_code,
      classes: values.classes,
      user: {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        password: "12345",
        role: "STUDENT",
        is_active: true,
      },
    };

    const res = await dispatch(addStudentAction(payload));
    if (res.success) {
      messageApi.success("Thêm student thành công!");
      // form.resetFields(); // nếu cần reset form
    } else {
      messageApi.error("Thêm thất bại!");
    }
  };

  return (
    <>
      {/* 👇 contextHolder phải nằm trong JSX để message hiển thị */}
      {contextHolder}

      <Card
        title="Thêm Student"
        style={{ maxWidth: 700, margin: "0 auto", marginTop: 24 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ is_active: true, role: "STUDENT" }}
        >
          <Space
            size="middle"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Form.Item
              label="First Name"
              name="first_name"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập First Name!" }]}
            >
              <Input placeholder="Nhập First Name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last_name"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập Last Name!" }]}
            >
              <Input placeholder="Nhập Last Name" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập phone!" }]}
            >
              <Input placeholder="Nhập phone" />
            </Form.Item>
          </Space>

          <Form.Item
            label="Student Code"
            name="student_code"
            rules={[{ required: true, message: "Vui lòng nhập mã sinh viên!" }]}
          >
            <Input placeholder="VD: 027" />
          </Form.Item>

          <Form.Item
            label="Class"
            name="classes"
            rules={[{ required: true, message: "Vui lòng chọn lớp!" }]}
          >
            <Select placeholder="Chọn lớp">
              {classes?.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name || c.id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Space
            size="middle"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>
          </Space>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu Student
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
