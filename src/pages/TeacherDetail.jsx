"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Space,
  DatePicker,
  message,
  Row,
  Col,
  Upload,
} from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { id } = useParams();
  const departments = useSelector((state) => state.DepartmentReducer.departments);
  const [messageApi, contextHolder] = message.useMessage();

  // State cho upload ảnh
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllAction("active"));

      if (id) {
        const res = await dispatch(getTeacherAction(id));
        if (res.success) {
          const u = res.data.user;
          form.setFieldsValue({
            teacher_code: res.data.teacher_code,
            degree: res.data.degree,
            title: res.data.title,
            department: res.data.department?.id || res.data.department,
            first_name: u?.first_name,
            last_name: u?.last_name,
            email: u?.email,
            phone: u?.phone,
            address: u?.address,
            identity_number: u?.identity_number,
            date_of_birth: u?.date_of_birth ? dayjs(u.date_of_birth) : null,
            gender: u?.gender === "M" ? "Nam" : "Nữ",
          });

          // Hiển thị ảnh cũ nếu có
            if (u?.url) {
            const imgUrl = u.url.startsWith("http")
              ? u.url
              : `http://localhost:8000${u.url}`;

            setFileList([
              {
                uid: "-1",
                name: "avatar.jpg",
                status: "done",
                url: imgUrl,
              },
            ]);
          } else {
            setFileList([]);
          }
        } else {
          messageApi.error("Không tìm thấy giáo viên!");
        }
      }
    };

    fetchData();
  }, [dispatch, id, form, messageApi]);

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Dữ liệu giáo viên
    formData.append("teacher_code", values.teacher_code);
    formData.append("degree", values.degree);
    formData.append("title", values.title);
    formData.append("department", values.department);

    // Dữ liệu user
    formData.append("user.email", values.email);
    formData.append("user.first_name", values.first_name);
    formData.append("user.last_name", values.last_name);
    formData.append("user.phone", values.phone);
    formData.append("user.address", values.address || "");
    formData.append("user.identity_number", values.identity_number || "");
    formData.append(
      "user.date_of_birth",
      values.date_of_birth ? values.date_of_birth.format("YYYY-MM-DD") : ""
    );
    formData.append("user.gender", values.gender === "Nam" ? "M" : "F");
    formData.append("user.password", "12345");
    formData.append("user.role", "TEACHER");
    formData.append("user.is_active", "true");

    // XỬ LÝ ẢNH
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.originFileObj) {
        formData.append("user.url", file.originFileObj); // File mới
      }
      // Nếu là ảnh cũ → không gửi → backend giữ nguyên
    } else {
      formData.append("user.url", ""); // Xóa ảnh
    }

    // DEBUG
    console.group("Teacher FormData");
    for (let [k, v] of formData.entries()) {
      if (v instanceof File) console.log(k, v.name, v.size);
      else console.log(k, v);
    }
    console.groupEnd();

    try {
      const res = id
        ? await dispatch(editTeacherAction(id, formData))
        : await dispatch(addTeacherAction(formData));

      if (res.success) {
        messageApi.success(id ? "Cập nhật thành công!" : "Thêm thành công!");
        setTimeout(() => navigate("/teachers"), 1000);
      } else {
        messageApi.error(res.message || "Thao tác thất bại!");
      }
    } catch (error) {
      messageApi.error("Lỗi hệ thống!");
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="h-full overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/teachers")}
              className="mb-4"
            >
              Quay lại
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <UserOutlined className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {id ? "Chỉnh sửa giáo viên" : "Thêm giáo viên mới"}
                </h1>
                <p className="text-sm text-gray-500">
                  {id ? "Cập nhật thông tin giáo viên" : "Tạo hồ sơ giáo viên mới"}
                </p>
              </div>
            </div>
          </div>

          <Card className="shadow-sm border border-gray-200">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              {/* ẢNH ĐẠI DIỆN */}
              <Form.Item label="Ảnh đại diện">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={({ fileList: newList }) => setFileList(newList.slice(-1))}
                  onRemove={() => setFileList([])}
                  accept=".png,.jpg,.jpeg"
                  maxCount={1}
                >
                  {fileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Mã giáo viên"
                    name="teacher_code"
                    rules={[{ required: true, message: "Vui lòng nhập mã giáo viên!" }]}
                  >
                    <Input placeholder="VD: T20001" size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Học vị"
                    name="degree"
                    rules={[{ required: true, message: "Vui lòng nhập học vị!" }]}
                  >
                    <Input placeholder="VD: Thạc sĩ, Tiến sĩ" size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Chức danh"
                    name="title"
                    rules={[{ required: true, message: "Vui lòng nhập chức danh!" }]}
                  >
                    <Input placeholder="VD: Giảng viên, Phó giáo sư" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Khoa"
                name="department"
                rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
              >
                <Select placeholder="Chọn khoa" size="large" loading={!departments}>
                  {departments?.map((d) => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="my-8 border-t pt-6">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Tên"
                      name="first_name"
                      rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Họ"
                      name="last_name"
                      rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="CCCD" name="identity_number">
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Ngày sinh" name="date_of_birth">
                      <DatePicker style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Giới tính" name="gender">
                      <Select placeholder="Chọn giới tính" size="large">
                        <Select.Option value="Nam">Nam</Select.Option>
                        <Select.Option value="Nữ">Nữ</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Địa chỉ" name="address">
                  <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
                </Form.Item>
              </div>

              <Form.Item className="mb-0">
                <Space size="middle">
                  <Button type="primary" htmlType="submit" size="large">
                    {id ? "Cập nhật" : "Thêm mới"}
                  </Button>
                  <Button size="large" onClick={() => navigate("/teachers")}>
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}