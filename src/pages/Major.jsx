"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Dropdown,
  Checkbox,
  Tag,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
  FundOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllAction } from "../redux/actions/DepartmentsAction";
import {
  addMajorAction,
  deleteMajorAction,
  editMajorAction,
  getAllMajorAction,
} from "../redux/actions/MajorAction";
import dayjs from "dayjs";
import { BiRecycle } from "react-icons/bi";

export default function Major() {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const departments = useSelector(
    (state) => state.DepartmentReducer.departments
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    department: true,
    created_at: true,
    updated_at: true,
    is_deleted: true,
  });

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllAction("active"));
      await dispatch(getAllMajorAction(statusFilter));
    };
    loadData();
  }, [dispatch, statusFilter]);

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
    const values = await form.validateFields();
    if (editingRecord) {
      const res = await dispatch(
        editMajorAction({ ...editingRecord, ...values })
      );
      if (res.success) {
        messageApi.success("edit major successfully!");
        dispatch(getAllMajorAction(statusFilter));
      } else {
        messageApi.error("Failed to edit major!");
      }
    } else {
      const res = await dispatch(addMajorAction(values));
      if (res.success) {
        messageApi.success("Thêm ngành thành công!");
        dispatch(getAllMajorAction(statusFilter));
      } else {
         messageApi.error(
            res.error?.response?.data?.message || "Thêm ngành thất bại!"
          );
      }
    }
    setIsModalVisible(false);
  };

  const filteredData = majors.filter((major) => {
    const searchLower = searchText.toLowerCase();
    const dept = departments.find(
      (d) => String(d.id) === String(major.department)
    );
    return (
      major.name?.toLowerCase().includes(searchLower) ||
      dept?.name?.toLowerCase().includes(searchLower)
    );
  });

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleStatus = (value) => {
    // const payload = {
    //   is_deleted: value === "active" ? 1 : 0,
    // };
    // if (value === "all") {
    //   dispatch(getAllAction({}));
    //   dispatch(getAllMajorAction({}));
    // } else if (value === "active") {
    //   dispatch(getAllAction(payload));
    //   dispatch(getAllMajorAction(payload));
    // } else {
    //   dispatch(getAllAction(payload));
    //   dispatch(getAllMajorAction(payload));
    // }
    setStatusFilter(value);
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteMajorAction(id));
    if (res.success) {
      messageApi.success("Thành công!");
      dispatch(getAllMajorAction(statusFilter));
    } else {
      messageApi.error("Xoá thất bại!");
    }
  };

  const columnMenu = {
    items: [
      {
        key: "id",
        label: (
          <Checkbox
            checked={visibleColumns.id}
            onChange={() => toggleColumn("id")}
          >
            ID
          </Checkbox>
        ),
      },
      {
        key: "name",
        label: (
          <Checkbox
            checked={visibleColumns.name}
            onChange={() => toggleColumn("name")}
          >
            Name
          </Checkbox>
        ),
      },
      {
        key: "department",
        label: (
          <Checkbox
            checked={visibleColumns.department}
            onChange={() => toggleColumn("department")}
          >
            Department
          </Checkbox>
        ),
      },
      {
        key: "created_at",
        label: (
          <Checkbox
            checked={visibleColumns.created_at}
            onChange={() => toggleColumn("created_at")}
          >
            Created At
          </Checkbox>
        ),
      },
      {
        key: "updated_at",
        label: (
          <Checkbox
            checked={visibleColumns.updated_at}
            onChange={() => toggleColumn("updated_at")}
          >
            Updated At
          </Checkbox>
        ),
      },
    ],
  };

  const allColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      visible: visibleColumns.id,
      width: 80,
    },
    {
      title: "Tên ngành",
      dataIndex: "name",
      key: "name",
      visible: visibleColumns.name,
      render: (name) => <Tag color='cyan'>{name}</Tag>,
    },
    {
      title: "Khoa",
      dataIndex: "department",
      key: "department",
      render: (department) => {
        // Kiểm tra nếu department là object có chứa tên
        if (department && department.department_name) {
          return department.department_name;
        }
        return "N/A";
      },
      visible: visibleColumns.department,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      visible: visibleColumns.is_deleted,
      render: (is_deleted) =>
        is_deleted === undefined ? (
          <Tag color='default'>N/A</Tag>
        ) : is_deleted === false ? (
          <Tag color='green'>Hoạt động</Tag>
        ) : (
          <Tag color='red'>Không hoạt động</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.is_deleted === true ? (
          <Button
            type='link'
            icon={<BiRecycle />}
            onClick={() => handleDelete(record.id)}
            className='text-indigo-600'
          />
        ) : (
          <Space>
            <Button
              type='link'
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              className='text-indigo-600'
            />
            <Popconfirm
              title='Bạn có chắc muốn xoá thông tin khoa này?'
              okText='OK'
              cancelText='Hủy'
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      visible: true,
      fixed: "right",
      width: 100,
    },
  ];

  const columns = allColumns.filter((col) => col.visible);

  return (
    <div className='h-full flex flex-col'>
      {contextHolder}
      <div className='bg-white rounded-xl shadow-sm p-6 flex flex-col h-full'>
        <div className='mb-6 flex-shrink-0'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center'>
              <FundOutlined className='text-indigo-600 text-lg' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Majors</h1>
              <p className='text-sm text-gray-500'>
                Manage major programs and specializations
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mb-6 gap-4 flex-shrink-0'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={showAddModal}
            size='large'
            className='shadow-sm'
          >
            Thêm mới
          </Button>

          <Space size='middle'>
            <Input
              placeholder='Search majors...'
              prefix={<SearchOutlined className='text-gray-400' />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size='large'
              allowClear
              className='rounded-lg'
            />

            <Select
              value={statusFilter}
              onChange={handleStatus}
              style={{ width: 180 }}
              size='large'
              options={[
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Không hoạt động" },
              ]}
            />

            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button
                icon={<SettingOutlined />}
                size='large'
                className='rounded-lg'
              >
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className='flex-1 overflow-hidden'>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} majors`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Chỉnh sửa thông tin ngành" : "Thêm ngành mới"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText='Save'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Tên ngành'
            name='name'
            rules={[{ required: true, message: "Vui lòng nhập tên ngành!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Khoa'
            name='department'
            rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
          >
            <Select placeholder='Vui lòng chọn khoa'>
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
