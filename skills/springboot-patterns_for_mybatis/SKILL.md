---
name: springboot-patterns_for_mybatis
description: MyBatis-focused Spring Boot backend patterns, including layered architecture, REST API design, mapper interfaces, XML SQL mapping, transaction boundaries, caching, async processing, validation, and logging. Use only for Java Spring Boot projects where MyBatis is the primary persistence layer. Do not use for JPA, Hibernate, or Spring Data JPA based projects.
origin: CUSTOM
---

# Spring Boot Development Patterns for MyBatis

Spring Boot architecture and API patterns for scalable, production-grade services that use MyBatis as the primary data access layer.

## Scope

Use this skill only when the project primarily uses:

- MyBatis mapper interfaces
- MyBatis XML mapper files
- SQL-centric persistence design
- Service-layer transaction orchestration over mapper calls

Do not use this skill for:

- Spring Data JPA projects
- Hibernate entity-centric projects
- Repository-first persistence architectures

## When to Activate

- Building REST APIs with Spring MVC or WebFlux
- Structuring controller → service → mapper layers
- Designing MyBatis mapper interfaces and XML SQL mapping
- Adding validation, exception handling, pagination, caching, or async processing
- Setting up profiles for dev/staging/production environments
- Implementing event-driven patterns with Spring Events or Kafka
- Reviewing transaction boundaries across multiple mapper calls
- Reviewing PostgreSQL / MySQL / Oracle SQL in MyBatis XML

## REST API Structure

```java
@RestController
@RequestMapping("/api/orders")
@Validated
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<OrderResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {

        OrderQueryRequest request = new OrderQueryRequest(page, size);
        PageResponse<OrderResponse> response = orderService.list(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### Guidelines

- Controllers should remain thin
- Controllers should validate request shape, then delegate quickly to service layer
- Controllers should not assemble SQL or implement business workflows
- Controllers should return DTO / response model objects, not persistence-layer objects directly

## Service Layer Pattern

```java
@Service
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;

    public OrderService(OrderMapper orderMapper, OrderItemMapper orderItemMapper) {
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        OrderEntity order = OrderEntity.from(request);
        orderMapper.insertOrder(order);

        for (CreateOrderItemRequest itemRequest : request.items()) {
            OrderItemEntity item = OrderItemEntity.from(order.getOrderId(), itemRequest);
            orderItemMapper.insertOrderItem(item);
        }

        return getById(order.getOrderId());
    }

    @Transactional(readOnly = true)
    public OrderResponse getById(Long orderId) {
        OrderDetailRow row = orderMapper.selectOrderDetailById(orderId);
        if (row == null) {
            throw new ResourceNotFoundException("Order not found");
        }
        return OrderResponse.from(row);
    }
}
```

### Guidelines

- Put business logic in service layer
- Put transaction boundaries in service layer, not controller or mapper layer
- Keep mapper layer focused on persistence only
- Use `@Transactional(readOnly = true)` for read-only queries when appropriate
- Keep external API calls, long-running jobs, and file I/O outside long DB transactions where possible

## Mapper Interface Pattern

```java
@Mapper
public interface OrderMapper {

    void insertOrder(OrderEntity order);

    OrderDetailRow selectOrderDetailById(@Param("orderId") Long orderId);

    List<OrderListRow> selectOrderPage(OrderQueryParam param);

    long countOrders(OrderQueryParam param);

    int updateOrderStatus(@Param("orderId") Long orderId,
                          @Param("status") String status,
                          @Param("upUser") String upUser);
}
```

### Guidelines

- Mapper methods should express persistence operations clearly
- Prefer typed parameter objects over large `Map<String, Object>` inputs
- Use `@Param` when multiple simple parameters are passed
- Keep mapper naming consistent with XML statement ids
- Separate generated CRUD mappers from custom business query mappers when both exist

## MyBatis XML Pattern

```xml
<select id="selectOrderPage" parameterType="com.example.order.OrderQueryParam"
        resultType="com.example.order.OrderListRow">
    SELECT
        o.order_id,
        o.order_no,
        o.order_status,
        o.order_date
    FROM tb_order o
    <where>
        <if test="orderNo != null and orderNo != ''">
            AND o.order_no = #{orderNo}
        </if>
        <if test="status != null and status != ''">
            AND o.order_status = #{status}
        </if>
    </where>
    ORDER BY o.order_date DESC, o.order_id DESC
    LIMIT #{limit} OFFSET #{offset}
</select>
```

### Guidelines

- Prefer `#{}` for value binding
- Treat `${}` as high risk and use only for strictly whitelisted structural SQL parts
- Avoid `SELECT *`
- Use explicit aliases in join-heavy SQL
- Ensure dynamic SQL cannot broaden the query unexpectedly
- Ensure update/delete SQL is safely scoped by business keys or identifiers

## Safe Dynamic ORDER BY Pattern

```xml
<choose>
    <when test="sortColumn == 'orderDate'">
        ORDER BY o.order_date
    </when>
    <when test="sortColumn == 'orderId'">
        ORDER BY o.order_id
    </when>
    <otherwise>
        ORDER BY o.order_id
    </otherwise>
</choose>
<choose>
    <when test="sortDirection == 'asc'">
        ASC
    </when>
    <otherwise>
        DESC
    </otherwise>
</choose>
```

### Guidelines

- Never pass raw request data into `${orderBy}`
- Whitelist all sortable columns
- Whitelist direction values such as `asc` / `desc`

## Safe IN Clause Pattern

```xml
<if test="orderIds != null and orderIds.size() > 0">
    AND o.order_id IN
    <foreach collection="orderIds" item="orderId" open="(" separator="," close=")">
        #{orderId}
    </foreach>
</if>
```

### Guidelines

- Use `<foreach>` for collections
- Guard empty collections explicitly
- Prevent invalid SQL such as `IN ()`

## Result Mapping Pattern

```xml
<resultMap id="OrderDetailResultMap" type="com.example.order.OrderDetailRow">
    <id property="orderId" column="order_id"/>
    <result property="orderNo" column="order_no"/>
    <result property="orderStatus" column="order_status"/>
    <result property="orderDate" column="order_date"/>
    <result property="customerName" column="customer_name"/>
</resultMap>
```

### Guidelines

- Use `resultType` for simple one-to-one flat mappings
- Use `resultMap` for joined queries, alias-heavy queries, or non-trivial object mapping
- Keep aliases explicit and stable
- Be careful with `association` / `collection` to avoid duplicate parent-row mapping

## DTOs and Validation

```java
public record CreateOrderRequest(
        @NotBlank String orderNo,
        @NotBlank String customerName,
        @NotEmpty List<@Valid CreateOrderItemRequest> items) {
}

public record CreateOrderItemRequest(
        @NotBlank String productCode,
        @Min(1) int quantity) {
}

public record OrderResponse(
        Long orderId,
        String orderNo,
        String orderStatus,
        String customerName) {
}
```

### Guidelines

- Validate request DTOs at API boundary
- Do not bind raw request objects directly into mapper layer
- Keep response DTOs separated from persistence objects where possible

## Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(java.util.stream.Collectors.joining(", "));
        return ResponseEntity.badRequest().body(ApiError.validation(message));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiError.of(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiError.of("Internal server error"));
    }
}
```

### Guidelines

- Centralize API error handling
- Do not expose raw SQL or stack traces to clients
- Do not return `200 OK` for business failure cases
- Distinguish validation, business, not-found, conflict, and system errors

## Pagination Pattern

```java
public record OrderQueryRequest(int page, int size) {

    public int offset() {
        return Math.max(page - 1, 0) * size;
    }

    public int limit() {
        return Math.max(size, 1);
    }
}
```

### Guidelines

- Use deterministic ordering for paging queries
- Prefer stable ordering such as `order_date DESC, order_id DESC`
- Ensure count query and list query use compatible filters
- Avoid in-memory pagination when DB paging is available

## Caching

Requires `@EnableCaching` on a configuration class.

```java
@Service
public class OrderCacheService {

    private final OrderMapper orderMapper;

    public OrderCacheService(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Cacheable(value = "order", key = "#orderId")
    public OrderResponse getById(Long orderId) {
        OrderDetailRow row = orderMapper.selectOrderDetailById(orderId);
        if (row == null) {
            throw new ResourceNotFoundException("Order not found");
        }
        return OrderResponse.from(row);
    }

    @CacheEvict(value = "order", key = "#orderId")
    public void evict(Long orderId) {
    }
}
```

### Guidelines

- Cache stable read-mostly data
- Evict or refresh cache after write operations
- Do not assume cache is the source of truth for transactional correctness

## Async Processing

Requires `@EnableAsync` on a configuration class.

```java
@Service
public class NotificationService {

    @Async("notificationExecutor")
    public java.util.concurrent.CompletableFuture<Void> sendAsync(Notification notification) {
        return java.util.concurrent.CompletableFuture.completedFuture(null);
    }
}
```

### Guidelines

- Use named executors for async workloads
- Avoid long DB transactions around async triggers
- Ensure async handlers are idempotent where retry is possible

## Logging (SLF4J)

```java
@Service
public class ReportService {

    private static final org.slf4j.Logger log =
            org.slf4j.LoggerFactory.getLogger(ReportService.class);

    public Report generate(Long orderId) {
        log.info("generate_report orderId={}", orderId);
        try {
            return new Report();
        } catch (Exception ex) {
            log.error("generate_report_failed orderId={}", orderId, ex);
            throw ex;
        }
    }
}
```

### Guidelines

- Use structured, context-rich logs
- Do not log passwords, tokens, authorization headers, or personal data unnecessarily
- Log failures with enough identifiers for tracing, but without leaking secrets

## Middleware / Filters

```java
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final org.slf4j.Logger log =
            org.slf4j.LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(
            jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response,
            jakarta.servlet.FilterChain filterChain)
            throws jakarta.servlet.ServletException, java.io.IOException {

        long start = System.currentTimeMillis();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - start;
            log.info("request method={} uri={} status={} durationMs={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus(),
                    duration);
        }
    }
}
```

### Guidelines

- Keep filters lightweight
- Avoid logging sensitive request payloads by default
- Prefer correlation ids / request ids for tracing

## Configuration / Profiles

```yaml
spring:
  profiles:
    active: dev

mybatis:
  mapper-locations: classpath*:mapper/**/*.xml
  type-aliases-package: com.example.domain
```

### Guidelines

- Separate environment-specific configuration by profile
- Keep secrets out of source control
- Keep MyBatis mapper path and alias packages explicit

## Testing Guidance

- Use unit tests for service-layer branching logic
- Use integration tests for complex mapper XML and SQL behavior
- Test empty collection, null filter, duplicate data, paging boundary, and invalid status transition cases
- Do not rely on sleep-based timing in async tests

## Anti-Patterns to Avoid

- SQL string assembly in controllers or services
- Unbounded list queries
- `${}` with raw request input
- Mapper interfaces with vague method names
- XML statements whose ids do not match interface methods
- Catching `Exception` and returning fake success
- Long transactions containing remote API calls
- Directly exposing DB row objects as public API contracts without review

## Review Hints for AI

When using this skill, prioritize:

1. Layer responsibility clarity
2. MyBatis SQL safety
3. Transaction boundary correctness
4. Pagination stability
5. N+1 or repeated round-trip risks
6. Mapper/XML consistency
7. Logging and validation completeness
8. Readability and maintainability of dynamic SQL
