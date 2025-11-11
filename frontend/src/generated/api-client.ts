/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * * `weekly` - Weekly
 * * `monthly` - Monthly
 */
export enum BudgetPreferenceEnum {
  Weekly = "weekly",
  Monthly = "monthly",
}

export interface ChildrenContributions {
  id: number;
  user: number;
  /** @maxLength 150 */
  child_name: string;
  /** @maxLength 150 */
  parent_name: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  total_contribution_planned?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  monthly_contribution?: string | null;
  /** @format date-time */
  created_at: string;
}

export interface Expense {
  id: number;
  user: number;
  /** @maxLength 255 */
  description: string;
  /** @maxLength 100 */
  category: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  amount: string;
  /** @format date */
  expense_date: string;
  /** @format date-time */
  created_at: string;
}

export interface Milestone {
  milestone_id: number;
  /** @maxLength 200 */
  title: string;
  description?: string | null;
}

export interface PatchedChildrenContributions {
  id?: number;
  user?: number;
  /** @maxLength 150 */
  child_name?: string;
  /** @maxLength 150 */
  parent_name?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  total_contribution_planned?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  monthly_contribution?: string | null;
  /** @format date-time */
  created_at?: string;
}

export interface PatchedExpense {
  id?: number;
  user?: number;
  /** @maxLength 255 */
  description?: string;
  /** @maxLength 100 */
  category?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  amount?: string;
  /** @format date */
  expense_date?: string;
  /** @format date-time */
  created_at?: string;
}

export interface PatchedUser {
  user_id?: number;
  /** @maxLength 150 */
  username?: string;
  /**
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  salary?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  total_balance?: string;
  /**
   * * `weekly` - Weekly
   * * `monthly` - Monthly
   */
  budget_preference?: BudgetPreferenceEnum;
  email_notification?: boolean;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface PatchedUserMilestones {
  id?: number;
  user?: number;
  milestone?: number;
  milestone_details?: Milestone;
  is_completed?: boolean;
  /** @format date-time */
  completed_at?: string | null;
}

export interface PatchedUserResponses {
  response_id?: number;
  user?: number;
  salary_confirmed?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  salary?: string | null;
  emergency_savings?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  emergency_savings_amount?: string | null;
  has_debt?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  debt_amount?: string | null;
  retirement_investing?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  retirement_savings_amount?: string | null;
  has_children?: boolean;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  children_count?: number | null;
  bought_home?: boolean;
  pay_off_home?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  mortgage_remaining?: string | null;
  /** @format date-time */
  submitted_at?: string;
}

export interface User {
  user_id: number;
  /** @maxLength 150 */
  username: string;
  /**
   * @format email
   * @maxLength 254
   */
  email: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  salary?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  total_balance?: string;
  /**
   * * `weekly` - Weekly
   * * `monthly` - Monthly
   */
  budget_preference?: BudgetPreferenceEnum;
  email_notification?: boolean;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface UserMilestones {
  id: number;
  user: number;
  milestone: number;
  milestone_details: Milestone;
  is_completed?: boolean;
  /** @format date-time */
  completed_at: string | null;
}

export interface UserResponses {
  response_id: number;
  user: number;
  salary_confirmed?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  salary?: string | null;
  emergency_savings?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  emergency_savings_amount?: string | null;
  has_debt?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  debt_amount?: string | null;
  retirement_investing?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  retirement_savings_amount?: string | null;
  has_children?: boolean;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  children_count?: number | null;
  bought_home?: boolean;
  pay_off_home?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  mortgage_remaining?: string | null;
  /** @format date-time */
  submitted_at: string;
}

export type ChildrenContributionsListData = ChildrenContributions[];

export type ChildrenContributionsCreateData = ChildrenContributions;

export interface ChildrenContributionsRetrieveParams {
  id: string;
}

export type ChildrenContributionsRetrieveData = ChildrenContributions;

export interface ChildrenContributionsUpdateParams {
  id: string;
}

export type ChildrenContributionsUpdateData = ChildrenContributions;

export interface ChildrenContributionsPartialUpdateParams {
  id: string;
}

export type ChildrenContributionsPartialUpdateData = ChildrenContributions;

export interface ChildrenContributionsDestroyParams {
  id: string;
}

export type ChildrenContributionsDestroyData = any;

export type ExpensesListData = Expense[];

export type ExpensesCreateData = Expense;

export interface ExpensesRetrieveParams {
  id: string;
}

export type ExpensesRetrieveData = Expense;

export interface ExpensesUpdateParams {
  id: string;
}

export type ExpensesUpdateData = Expense;

export interface ExpensesPartialUpdateParams {
  id: string;
}

export type ExpensesPartialUpdateData = Expense;

export interface ExpensesDestroyParams {
  id: string;
}

export type ExpensesDestroyData = any;

export type MilestonesListData = Milestone[];

export interface MilestonesRetrieveParams {
  /** A unique integer value identifying this milestone. */
  milestoneId: number;
}

export type MilestonesRetrieveData = Milestone;

export type UserMilestonesListData = UserMilestones[];

export type UserMilestonesCreateData = UserMilestones;

export interface UserMilestonesRetrieveParams {
  id: string;
}

export type UserMilestonesRetrieveData = UserMilestones;

export interface UserMilestonesUpdateParams {
  id: string;
}

export type UserMilestonesUpdateData = UserMilestones;

export interface UserMilestonesPartialUpdateParams {
  id: string;
}

export type UserMilestonesPartialUpdateData = UserMilestones;

export interface UserMilestonesDestroyParams {
  id: string;
}

export type UserMilestonesDestroyData = any;

export type UserResponsesListData = UserResponses[];

export type UserResponsesCreateData = UserResponses;

export interface UserResponsesRetrieveParams {
  id: string;
}

export type UserResponsesRetrieveData = UserResponses;

export interface UserResponsesUpdateParams {
  id: string;
}

export type UserResponsesUpdateData = UserResponses;

export interface UserResponsesPartialUpdateParams {
  id: string;
}

export type UserResponsesPartialUpdateData = UserResponses;

export interface UserResponsesDestroyParams {
  id: string;
}

export type UserResponsesDestroyData = any;

export type UsersListData = User[];

export type UsersCreateData = User;

export interface UsersRetrieveParams {
  /** A unique integer value identifying this user. */
  userId: number;
}

export type UsersRetrieveData = User;

export interface UsersUpdateParams {
  /** A unique integer value identifying this user. */
  userId: number;
}

export type UsersUpdateData = User;

export interface UsersPartialUpdateParams {
  /** A unique integer value identifying this user. */
  userId: number;
}

export type UsersPartialUpdateData = User;

export interface UsersDestroyParams {
  /** A unique integer value identifying this user. */
  userId: number;
}

export type UsersDestroyData = any;

export type UsersProfileRetrieveData = User;

export type UsersProfileUpdateData = User;

export type UsersProfilePartialUpdateData = User;

export type UsersRegisterCreateData = User;

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Financial Planning API
 * @version 1.0.0
 *
 * API for financial planning and budgeting application
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsList
     * @request GET:/api/children-contributions/
     * @secure
     */
    childrenContributionsList: (params: RequestParams = {}) =>
      this.request<ChildrenContributionsListData, any>({
        path: `/api/children-contributions/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsCreate
     * @request POST:/api/children-contributions/
     * @secure
     */
    childrenContributionsCreate: (
      data: ChildrenContributions,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsCreateData, any>({
        path: `/api/children-contributions/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsRetrieve
     * @request GET:/api/children-contributions/{id}/
     * @secure
     */
    childrenContributionsRetrieve: (
      { id, ...query }: ChildrenContributionsRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsRetrieveData, any>({
        path: `/api/children-contributions/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsUpdate
     * @request PUT:/api/children-contributions/{id}/
     * @secure
     */
    childrenContributionsUpdate: (
      { id, ...query }: ChildrenContributionsUpdateParams,
      data: ChildrenContributions,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsUpdateData, any>({
        path: `/api/children-contributions/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsPartialUpdate
     * @request PATCH:/api/children-contributions/{id}/
     * @secure
     */
    childrenContributionsPartialUpdate: (
      { id, ...query }: ChildrenContributionsPartialUpdateParams,
      data: PatchedChildrenContributions,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsPartialUpdateData, any>({
        path: `/api/children-contributions/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsDestroy
     * @request DELETE:/api/children-contributions/{id}/
     * @secure
     */
    childrenContributionsDestroy: (
      { id, ...query }: ChildrenContributionsDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsDestroyData, any>({
        path: `/api/children-contributions/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesList
     * @request GET:/api/expenses/
     * @secure
     */
    expensesList: (params: RequestParams = {}) =>
      this.request<ExpensesListData, any>({
        path: `/api/expenses/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesCreate
     * @request POST:/api/expenses/
     * @secure
     */
    expensesCreate: (data: Expense, params: RequestParams = {}) =>
      this.request<ExpensesCreateData, any>({
        path: `/api/expenses/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesRetrieve
     * @request GET:/api/expenses/{id}/
     * @secure
     */
    expensesRetrieve: (
      { id, ...query }: ExpensesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<ExpensesRetrieveData, any>({
        path: `/api/expenses/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesUpdate
     * @request PUT:/api/expenses/{id}/
     * @secure
     */
    expensesUpdate: (
      { id, ...query }: ExpensesUpdateParams,
      data: Expense,
      params: RequestParams = {},
    ) =>
      this.request<ExpensesUpdateData, any>({
        path: `/api/expenses/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesPartialUpdate
     * @request PATCH:/api/expenses/{id}/
     * @secure
     */
    expensesPartialUpdate: (
      { id, ...query }: ExpensesPartialUpdateParams,
      data: PatchedExpense,
      params: RequestParams = {},
    ) =>
      this.request<ExpensesPartialUpdateData, any>({
        path: `/api/expenses/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesDestroy
     * @request DELETE:/api/expenses/{id}/
     * @secure
     */
    expensesDestroy: (
      { id, ...query }: ExpensesDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<ExpensesDestroyData, any>({
        path: `/api/expenses/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags milestones
     * @name MilestonesList
     * @request GET:/api/milestones/
     * @secure
     */
    milestonesList: (params: RequestParams = {}) =>
      this.request<MilestonesListData, any>({
        path: `/api/milestones/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags milestones
     * @name MilestonesRetrieve
     * @request GET:/api/milestones/{milestone_id}/
     * @secure
     */
    milestonesRetrieve: (
      { milestoneId, ...query }: MilestonesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<MilestonesRetrieveData, any>({
        path: `/api/milestones/${milestoneId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesList
     * @request GET:/api/user-milestones/
     * @secure
     */
    userMilestonesList: (params: RequestParams = {}) =>
      this.request<UserMilestonesListData, any>({
        path: `/api/user-milestones/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesCreate
     * @request POST:/api/user-milestones/
     * @secure
     */
    userMilestonesCreate: (data: UserMilestones, params: RequestParams = {}) =>
      this.request<UserMilestonesCreateData, any>({
        path: `/api/user-milestones/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesRetrieve
     * @request GET:/api/user-milestones/{id}/
     * @secure
     */
    userMilestonesRetrieve: (
      { id, ...query }: UserMilestonesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<UserMilestonesRetrieveData, any>({
        path: `/api/user-milestones/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesUpdate
     * @request PUT:/api/user-milestones/{id}/
     * @secure
     */
    userMilestonesUpdate: (
      { id, ...query }: UserMilestonesUpdateParams,
      data: UserMilestones,
      params: RequestParams = {},
    ) =>
      this.request<UserMilestonesUpdateData, any>({
        path: `/api/user-milestones/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesPartialUpdate
     * @request PATCH:/api/user-milestones/{id}/
     * @secure
     */
    userMilestonesPartialUpdate: (
      { id, ...query }: UserMilestonesPartialUpdateParams,
      data: PatchedUserMilestones,
      params: RequestParams = {},
    ) =>
      this.request<UserMilestonesPartialUpdateData, any>({
        path: `/api/user-milestones/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesDestroy
     * @request DELETE:/api/user-milestones/{id}/
     * @secure
     */
    userMilestonesDestroy: (
      { id, ...query }: UserMilestonesDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<UserMilestonesDestroyData, any>({
        path: `/api/user-milestones/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesList
     * @request GET:/api/user-responses/
     * @secure
     */
    userResponsesList: (params: RequestParams = {}) =>
      this.request<UserResponsesListData, any>({
        path: `/api/user-responses/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesCreate
     * @request POST:/api/user-responses/
     * @secure
     */
    userResponsesCreate: (data: UserResponses, params: RequestParams = {}) =>
      this.request<UserResponsesCreateData, any>({
        path: `/api/user-responses/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesRetrieve
     * @request GET:/api/user-responses/{id}/
     * @secure
     */
    userResponsesRetrieve: (
      { id, ...query }: UserResponsesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<UserResponsesRetrieveData, any>({
        path: `/api/user-responses/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesUpdate
     * @request PUT:/api/user-responses/{id}/
     * @secure
     */
    userResponsesUpdate: (
      { id, ...query }: UserResponsesUpdateParams,
      data: UserResponses,
      params: RequestParams = {},
    ) =>
      this.request<UserResponsesUpdateData, any>({
        path: `/api/user-responses/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesPartialUpdate
     * @request PATCH:/api/user-responses/{id}/
     * @secure
     */
    userResponsesPartialUpdate: (
      { id, ...query }: UserResponsesPartialUpdateParams,
      data: PatchedUserResponses,
      params: RequestParams = {},
    ) =>
      this.request<UserResponsesPartialUpdateData, any>({
        path: `/api/user-responses/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesDestroy
     * @request DELETE:/api/user-responses/{id}/
     * @secure
     */
    userResponsesDestroy: (
      { id, ...query }: UserResponsesDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<UserResponsesDestroyData, any>({
        path: `/api/user-responses/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersList
     * @request GET:/api/users/
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<UsersListData, any>({
        path: `/api/users/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersCreate
     * @request POST:/api/users/
     * @secure
     */
    usersCreate: (data: User, params: RequestParams = {}) =>
      this.request<UsersCreateData, any>({
        path: `/api/users/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRetrieve
     * @request GET:/api/users/{user_id}/
     * @secure
     */
    usersRetrieve: (
      { userId, ...query }: UsersRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<UsersRetrieveData, any>({
        path: `/api/users/${userId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdate
     * @request PUT:/api/users/{user_id}/
     * @secure
     */
    usersUpdate: (
      { userId, ...query }: UsersUpdateParams,
      data: User,
      params: RequestParams = {},
    ) =>
      this.request<UsersUpdateData, any>({
        path: `/api/users/${userId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersPartialUpdate
     * @request PATCH:/api/users/{user_id}/
     * @secure
     */
    usersPartialUpdate: (
      { userId, ...query }: UsersPartialUpdateParams,
      data: PatchedUser,
      params: RequestParams = {},
    ) =>
      this.request<UsersPartialUpdateData, any>({
        path: `/api/users/${userId}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersDestroy
     * @request DELETE:/api/users/{user_id}/
     * @secure
     */
    usersDestroy: (
      { userId, ...query }: UsersDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<UsersDestroyData, any>({
        path: `/api/users/${userId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersProfileRetrieve
     * @request GET:/api/users/profile/
     * @secure
     */
    usersProfileRetrieve: (params: RequestParams = {}) =>
      this.request<UsersProfileRetrieveData, any>({
        path: `/api/users/profile/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersProfileUpdate
     * @request PUT:/api/users/profile/
     * @secure
     */
    usersProfileUpdate: (data: User, params: RequestParams = {}) =>
      this.request<UsersProfileUpdateData, any>({
        path: `/api/users/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersProfilePartialUpdate
     * @request PATCH:/api/users/profile/
     * @secure
     */
    usersProfilePartialUpdate: (
      data: PatchedUser,
      params: RequestParams = {},
    ) =>
      this.request<UsersProfilePartialUpdateData, any>({
        path: `/api/users/profile/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/api/users/register/
     * @secure
     */
    usersRegisterCreate: (data: User, params: RequestParams = {}) =>
      this.request<UsersRegisterCreateData, any>({
        path: `/api/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
