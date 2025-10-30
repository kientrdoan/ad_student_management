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
  addStudentAction,
  editStudentAction,
  getStudentAction,
} from "../redux/actions/StudentAction";
import { getAllClassAction } from "../redux/actions/ClassAction";

export default function StudentDetail() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const classes = useSelector((state) => state.ClassReducer.classes);
  const [messageApi, contextHolder] = message.useMessage();

  const [fileList, setFileList] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllClassAction());

      if (id) {
        const res = await dispatch(getStudentAction(id));
        if (res.success) {
          const u = res.data.user;

          // ✅ Gán dữ liệu form
          form.setFieldsValue({
            student_code: res.data.student_code,
            class_student: res.data.class_student?.id,
            first_name: u?.first_name,
            last_name: u?.last_name,
            email: u?.email,
            phone: u?.phone,
            address: u?.address,
            identity_number: u?.identity_number,
            birthday: u?.birthday ? dayjs(u.birthday) : null,
            gender: u?.gender === "M" ? "Nam" : "Nữ",
          });

          // ✅ Hiển thị ảnh preview nếu có (sửa chỗ này)
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
        }
      }
    };
    fetchData();
  }, [dispatch, id, form]);

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Dữ liệu sinh viên
    formData.append("student_code", values.student_code);
    formData.append("class_student", values.class_student);

    // Dữ liệu user
    formData.append("user.email", values.email);
    formData.append("user.first_name", values.first_name);
    formData.append("user.last_name", values.last_name);
    formData.append("user.phone", values.phone);
    formData.append("user.address", values.address || "");
    formData.append("user.identity_number", values.identity_number || "");
    formData.append(
      "user.birthday",
      values.birthday ? values.birthday.format("YYYY-MM-DD") : ""
    );
    formData.append("user.gender", values.gender === "Nam" ? "M" : "F");
    formData.append("user.password", "12345");
    formData.append("user.role", "STUDENT");
    formData.append("user.is_active", "true");

    // XỬ LÝ FILE ẢNH
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.originFileObj) {
        // File mới được chọn từ máy
        formData.append("user.url", file.originFileObj);
      }
      // Nếu là ảnh cũ (chỉ có url), backend sẽ giữ nguyên
    } else {
      // Không có file → xóa avatar (nếu muốn)
      // formData.append("user.url", ""); // Gửi rỗng để xóa
    }

    // DEBUG: Xem dữ liệu gửi đi
    console.group("FormData Debug");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, value.name, value.size, "bytes");
      } else {
        console.log(key, value);
      }
    }
    console.groupEnd();

    try {
      const res = id
        ? await dispatch(editStudentAction(id, formData))
        : await dispatch(addStudentAction(formData));

      if (res.success) {
        messageApi.success(id ? "Cập nhật thành công!" : "Thêm thành công!");
        setTimeout(() => navigate("/students"), 1000);
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
      <div className='max-w-4xl mx-auto'>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/students")}
          className='mb-4'
        >
          Quay lại
        </Button>

        <Card title={id ? "Chỉnh sửa sinh viên" : "Thêm sinh viên mới"}>
          <Form form={form} layout='vertical' onFinish={handleSubmit}>
            {/* UPLOAD ẢNH - KHÔNG DÙNG name='file' */}
            <Form.Item label='Ảnh đại diện'>
              <Upload
                listType='picture-card'
                fileList={fileList}
                beforeUpload={() => false} // Ngăn upload tự động
                onChange={({ fileList: newList }) => {
                  // Chỉ giữ 1 file
                  setFileList(newList.slice(-1));
                }}
                onRemove={() => setFileList([])}
                accept='.png,.jpg,.jpeg'
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
              <Col span={12}>
                <Form.Item
                  label='Mã sinh viên'
                  name='student_code'
                  rules={[{ required: true, message: "Nhập mã sinh viên!" }]}
                >
                  <Input placeholder='VD: S20001' size='large' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Lớp sinh viên'
                  name='class_student'
                  rules={[{ required: true, message: "Chọn lớp sinh viên!" }]}
                >
                  <Select
                    placeholder='Chọn lớp'
                    size='large'
                    loading={!classes}
                  >
                    {classes?.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label='Tên'
                  name='first_name'
                  rules={[{ required: true, message: "Nhập tên!" }]}
                >
                  <Input size='large' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Họ'
                  name='last_name'
                  rules={[{ required: true, message: "Nhập họ!" }]}
                >
                  <Input size='large' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label='Email'
                  name='email'
                  rules={[
                    { required: true, message: "Nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input size='large' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Số điện thoại'
                  name='phone'
                  rules={[{ required: true, message: "Nhập số điện thoại!" }]}
                >
                  <Input size='large' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label='CCCD' name='identity_number'>
                  <Input size='large' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='Ngày sinh' name='birthday'>
                  <DatePicker style={{ width: "100%" }} size='large' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='Giới tính' name='gender'>
                  <Select placeholder='Chọn giới tính' size='large'>
                    <Select.Option value='Nam'>Nam</Select.Option>
                    <Select.Option value='Nữ'>Nữ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label='Địa chỉ' name='address'>
              <Input.TextArea rows={2} placeholder='Nhập địa chỉ' />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type='primary' htmlType='submit' size='large'>
                  {id ? "Cập nhật" : "Thêm mới"}
                </Button>
                <Button size='large' onClick={() => navigate("/students")}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}
