/* eslint-disable no-unused-vars */
import { useEffect } from "react";
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
} from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
  addStudentAction,
  editStudentAction,
  getStudentAction,
} from "../redux/actions/StudentAction";
// import { getAllMajorAction } from "../redux/actions/MajorAction";
import { getAllClassAction } from "../redux/actions/ClassAction";

export default function StudentDetail() {
  console.log("[v0] StudentDetail component is rendering");

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const classes = useSelector((state) => state.ClassReducer.classes);

  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();

  console.log("[v0] StudentDetail - Route ID:", id);

  useEffect(() => {
    const fetchData = async () => {
      // await dispatch(getAllMajorAction());
      await dispatch(getAllClassAction());

      if (id) {
        const res = await dispatch(getStudentAction(id));
        if (res.success) {
          form.setFieldsValue({
            student_code: res.data.student_code,
            // major: res.data.major,
            class_student: res.data.class_student.id,
            first_name: res.data.user?.first_name,
            last_name: res.data.user?.last_name,
            email: res.data.user?.email,
            phone: res.data.user?.phone,
            address: res.data.user?.address,
            identity_number: res.data.user?.identity_number,
            birthday: res.data.user?.birthday
              ? dayjs(res.data.user.birthday)
              : null,
            gender: res.data.user?.gender === "M" ? "Nam" : "Nữ",
          });
        } else {
          messageApi.error("Không tìm thấy student!");
        }
      }
    };

    fetchData();
  }, [dispatch, id, form, messageApi]);

  const handleSubmit = async (values) => {
    const payload = {
      student_code: values.student_code,
      // major: values.major,
      class_student: values.class_student,
      user: {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        address: values.address,
        identity_number: values.identity_number,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        gender: values.gender === "Nam" ? "M" : "F",
        password: "12345",
        role: "STUDENT",
        is_active: true,
      },
    };

    if (id) {
      const res = await dispatch(editStudentAction(id, payload));
      if (res.success) {
        messageApi.success("Cập nhật student thành công!");
        setTimeout(() => navigate("/students"), 1000);
      } else {
        messageApi.error("Thao tác thất bại!");
      }
    } else {
      const res = await dispatch(addStudentAction(payload));
      if (res.success) {
        messageApi.success("Thêm student thành công!");
        setTimeout(() => navigate("/students"), 1000);
      } else {
        messageApi.error("Thao tác thất bại!");
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className='h-full overflow-auto'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-6'>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/students")}
              className='mb-4'
            >
              Back
            </Button>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center'>
                <UserOutlined className='text-indigo-600 text-xl' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  {id ? "Cập nhật thông tin sinh viên" : "Thêm mới sinh viên"}
                </h1>
                <p className='text-sm text-gray-500'>
                  {id
                    ? "Update student information"
                    : "Create a new student record"}
                </p>
              </div>
            </div>
          </div>

          <Card className='shadow-sm border border-gray-200'>
            <Form form={form} layout='vertical' onFinish={handleSubmit}>
              <div className=''>
                {/* <h3 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200'>
                  Student Information
                </h3> */}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label='Mã sinh viên'
                      name='student_code'
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã sinh viên!",
                        },
                      ]}
                    >
                      <Input placeholder='e.g. S20001' size='large' />
                    </Form.Item>
                  </Col>
                  {/* <Col span={12}>
                    <Form.Item
                      label='Ngành'
                      name='major'
                      rules={[
                        { required: true, message: "Vui lòng chọn ngành!" },
                      ]}
                    >
                      <Select placeholder='Vui lòng chọn ngành' size='large'>
                        {majors?.map((m) => (
                          <Select.Option key={m.id} value={m.id}>
                            {m.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col> */}

                  <Col span={12}>
                    <Form.Item
                      label='Lớp sinh viên'
                      name='class_student'
                      rules={[{ required: true, message: "Vui lòng chọn lớp sinh viên!" }]}
                    >
                      <Select placeholder='Vui lòng chọn lớp sinh viên' size='large'>
                        {classes?.map((m) => (
                          <Select.Option key={m.id} value={m.id}>
                            {m.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>

             

              <div className='mb-6'>
                {/* <h3 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200'>
                  Personal Information
                </h3> */}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label='Tên'
                      name='first_name'
                      rules={[
                        { required: true, message: "Vui lòng nhập tên!" },
                      ]}
                    >
                      <Input placeholder='Vui lòng nhập tên' size='large' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label='Họ'
                      name='last_name'
                      rules={[
                        { required: true, message: "Vui lòng nhập họ!" },
                      ]}
                    >
                      <Input placeholder='Vui lòng nhập họ' size='large' />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label='Email'
                      name='email'
                      rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Invalid email format!" },
                      ]}
                    >
                      <Input placeholder='Vui lòng nhập email' size='large' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label='Số điện thoại'
                      name='phone'
                      rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                      ]}
                    >
                      <Input placeholder='Vui lòng nhập số điện thoại' size='large' />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label='CCCD' name='identity_number'>
                      <Input placeholder='Vui lòng nhập cccd' size='large' />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='Ngày sinh' name='birthday'>
                      <DatePicker style={{ width: "100%" }} size='large' />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='Giới tính' name='gender'>
                      <Select placeholder='Select gender' size='large'>
                        <Select.Option value='Nam'>Male</Select.Option>
                        <Select.Option value='Nữ'>Female</Select.Option>
                        <Select.Option value='Khác'>Other</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label='Địa chỉ' name='address'>
                  <Input.TextArea rows={2} placeholder='Enter address' />
                </Form.Item>
              </div>

              <Form.Item className='mb-0'>
                <Space size='middle'>
                  <Button type='primary' htmlType='submit' size='large'>
                    {id ? "Update Student" : "Create Student"}
                  </Button>
                  <Button size='large' onClick={() => navigate("/students")}>
                    Cancel
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
