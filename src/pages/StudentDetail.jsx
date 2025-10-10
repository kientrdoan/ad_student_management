/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Space,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllMajorAction } from "../redux/actions/MajorAction";
import {
  addSubjectAction,
  editSubjectAction,
  getSubjectAction,
} from "../redux/actions/SubjectAction";
import { useParams, useNavigate } from "react-router-dom";

export default function SubjectDetail() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllMajorAction());

      if (id) {
        const res = await dispatch(getSubjectAction(id));
        if (res?.data) {
          form.setFieldsValue({
            code: res.data.code,
            name: res.data.name,
            credit: res.data.credit,
            description: res.data.description,
            total_period: res.data.total_period,
            theory_period: res.data.theory_period,
            lab_period: res.data.lab_period,
            major: res.data.major,
          });
        } else {
          messageApi.error("Không tìm thấy môn học!");
        }
      }
    };
    fetchData();
  }, [dispatch, id, form, messageApi]);

  const handleSubmit = async (values) => {
    let res;
    if (id) {
      res = await dispatch(editSubjectAction({ id, ...values }));
    } else {
      res = await dispatch(addSubjectAction(values));
    }

    if (res?.success) {
      messageApi.success(id ? "Cập nhật môn học thành công!" : "Thêm môn học thành công!");
      navigate("/subjects");
    } else {
      messageApi.error("Thao tác thất bại!");
    }
  };

  return (
    <>
      {contextHolder}
      <Card
        title={id ? "Cập nhật Môn học" : "Thêm Môn học"}
        style={{ maxWidth: 700, margin: "0 auto", marginTop: 24 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ credit: 3 }}
        >
          {/* Hàng 1: Code + Name */}
          <Space
            size="middle"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Form.Item
              label="Code"
              name="code"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập mã môn học!" }]}
            >
              <Input placeholder="VD: CS101" />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}
            >
              <Input placeholder="VD: Introduction to Programming" />
            </Form.Item>
          </Space>

          {/* Hàng 2: Credit + Major */}
          <Space
            size="middle"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Form.Item
              label="Credit"
              name="credit"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập số tín chỉ!" }]}
            >
              <InputNumber min={1} max={10} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Major"
              name="major"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng chọn chuyên ngành!" }]}
            >
              <Select placeholder="Chọn chuyên ngành">
                {majors?.map((m) => (
                  <Select.Option key={m.id} value={m.id}>
                    {m.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>

          {/* Description */}
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Nhập mô tả môn học..." />
          </Form.Item>

          {/* Hàng 3: Total Period + Theory Period + Lab Period */}
          <Space
            size="middle"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Form.Item
              label="Total Period"
              name="total_period"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập tổng số tiết!" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Theory Period"
              name="theory_period"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập số tiết lý thuyết!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Lab Period"
              name="lab_period"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập số tiết thực hành!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block>
              {id ? "Cập nhật Môn học" : "Lưu Môn học"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
