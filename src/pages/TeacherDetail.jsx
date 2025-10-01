import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Space,
  DatePicker,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  addTeacherAction,
  editTeacherAction,
  getTeacherAction,
} from "../redux/actions/TeacherAction";
import { getAllAction } from "../redux/actions/DepartmentsAction";

export default function TeacherDetail() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const departments = useSelector(
    (state) => state.DepartmentReducer.departments
  );

  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllAction());

      if (id) {
        const res = await dispatch(getTeacherAction(id));
        if (res.success) {
          form.setFieldsValue({
            instructor_code: res.data.instructor_code,
            degree: res.data.degree,
            title: res.data.title,
            department: res.data.department,
            first_name: res.data.user?.first_name,
            last_name: res.data.user?.last_name,
            email: res.data.user?.email,
            phone: res.data.user?.phone,
            address: res.data.user?.address,
            identity_number: res.data.user?.identity_number,
            date_of_birth: res.data.user?.date_of_birth
              ? dayjs(res.data.user.date_of_birth)
              : null,
            gender: res.data.user?.gender === "M" ? "Nam" : "Nữ",
            url: res.data.user?.url,
          });
        } else {
          messageApi.error("Không tìm thấy teacher!");
        }
      }
    };

    fetchData();
  }, [dispatch, id, form, messageApi]);

  const handleSubmit = async (values) => {
    const payload = {
      instructor_code: values.instructor_code,
      degree: values.degree,
      title: values.title,
      department: values.department,
      user: {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        address: values.address,
        identity_number: values.identity_number,
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.format("YYYY-MM-DD")
          : null,
        gender: values.gender === "Nam" ? "M" : "F",
        url: values.url,
        password: "12345", // có thể fix cứng hoặc backend set
        role: "TEACHER",
        is_active: true,
      },
    };

    if (id) {
      const res = await dispatch(editTeacherAction(id, payload));
      if (res.success) {
        messageApi.success("Cập nhật teacher thành công!");
      } else {
        messageApi.error("Thao tác thất bại!");
      }
    } else {
      const res = await dispatch(addTeacherAction(payload));
      if (res.success) {
        messageApi.success("Thêm teacher thành công!");
      } else {
        messageApi.error("Thao tác thất bại!");
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Card
        title={id ? "Cập nhật Teacher" : "Thêm Teacher"}
        style={{ maxWidth: 800, margin: "0 auto", marginTop: 24 }}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          {/* Teacher Info */}
          <Space size='middle' style={{ width: "100%", display: "flex" }}>
            <Form.Item
              label='Instructor Code'
              name='instructor_code'
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "Vui lòng nhập mã giảng viên!" },
              ]}
            >
              <Input placeholder='VD: T20' />
            </Form.Item>

            <Form.Item label='Degree' name='degree' style={{ flex: 1 }}>
              <Input placeholder='VD: Master, PhD' />
            </Form.Item>

            <Form.Item label='Title' name='title' style={{ flex: 1 }}>
              <Input placeholder='VD: Professor, Lecturer' />
            </Form.Item>
          </Space>

          <Form.Item
            label='Department'
            name='department'
            rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
          >
            <Select placeholder='Chọn khoa'>
              {departments?.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name || d.id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* User Info */}
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>Thông tin cá nhân</h3>
          <Space size='middle' style={{ width: "100%" }}>
            <Form.Item
              label='First Name'
              name='first_name'
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập First Name!" }]}
            >
              <Input placeholder='Nhập First Name' />
            </Form.Item>

            <Form.Item
              label='Last Name'
              name='last_name'
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập Last Name!" }]}
            >
              <Input placeholder='Nhập Last Name' />
            </Form.Item>

            <Form.Item
              label='Identity Number'
              name='identity_number'
              style={{ flex: 1 }}
            >
              <Input placeholder='CMND/CCCD' />
            </Form.Item>

            <Form.Item
              label='Date of Birth'
              name='date_of_birth'
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Space size='middle' style={{ width: "100%" }}>
            <Form.Item
              label='Email'
              name='email'
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder='Nhập Email' />
            </Form.Item>

            <Form.Item
              label='Phone'
              name='phone'
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder='Nhập Phone' />
            </Form.Item>

            <Form.Item label='Gender' name='gender' style={{ flex: 1 }}>
              <Select placeholder='Chọn giới tính'>
                <Select.Option value='male'>Nam</Select.Option>
                <Select.Option value='female'>Nữ</Select.Option>
                <Select.Option value='other'>Khác</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item label='Address' name='address'>
            <Input placeholder='Nhập địa chỉ' />
          </Form.Item>

          <Space size='middle' style={{ width: "100%" }}>
            {/* <Form.Item label="Avatar URL" name="url" style={{ flex: 1 }}>
              <Input placeholder="Nhập URL avatar" />
            </Form.Item> */}
          </Space>

          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              {id ? "Cập nhật Teacher" : "Lưu Teacher"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
